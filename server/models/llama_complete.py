import os
from datetime import date

from langchain import hub
from langchain.agents import load_tools, create_react_agent, AgentExecutor
from langchain.memory import ConversationBufferWindowMemory
from langchain_community.tools.ddg_search.tool import DuckDuckGoSearchResults, DuckDuckGoSearchRun
from langchain_community.utilities.duckduckgo_search import DuckDuckGoSearchAPIWrapper
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableMap
from langchain_core.tools import Tool
from langsmith import Client

from server.service.llama_functions import llm


# Alot of this code is pulled from AgentToRouter.py and llama_functions.py
def llama_complete(question: str, memory: ConversationBufferWindowMemory):
    llama = llm()
    router_memory = memory

    # langsmith tracking
    os.environ["LANGCHAIN_TRACING_V2"] = "true"
    os.environ["LANGCHAIN_ENDPOINT"] = "https://api.smith.langchain.com"
    os.environ["LANGCHAIN_API_KEY"] = "ls__de882389727f48219891d9e0849bc26b"
    os.environ["LANGCHAIN_PROJECT"] = "Llama2-70bchat-advanced"
    client = Client()

    # Prompt template for conversation selection
    prompt = PromptTemplate.from_template("""
    You are called Learnix, with the main goal to help people with their academics and research. ONLY respond with a
    single word, DO NOT add on any other statements, questions, or concerns.
    Choose one of the following actions:
    
     - If the question is a greeting or has "you","your", "Learnix", or "I", references you as an AI, then respond ONLY
      with 'GENERAL'
     - If the question needs more information and you want to search the web and uses words such as "recent", "current", "now", "this year",
      or time / day of the year, and is not in your training set, respond ONLY with 'SEARCH'
     - If the question is about specific academic papers, meaning a DOI number (ex: 1888.083919) or specific academic author, respond ONLY
      with 'PAPER'
     - If the question could be answered with some more information from academic papers, respond ONLY with 'PAPERSEARCH'
     - If you already have an answer or don't know which to respond to, respond ONLY with 'ANSWER'
     - If you don't know the answer and don't choose any previous options, respond ONLY with 'GENERAL'
    
    To repeat, the only words you can respond with are: 'GENERAL', 'SEARCH', 'PAPER', 'PAPERSEARCH', 'ANSWER'
    
    If there is a previous conversation, use it ONLY context for the question: {chat_history}
    Question: {question}
    """
                                          )

    # Base Chain Prompt
    base_chain = PromptTemplate.from_template("""
    You are called Learnix, but do not mention yourself, with the main goal to help people with their academics and research.
    Keep the answer under 300 words max, but make sure to give a detailed answer.
    The current year is""" + str(date.today().year) + """ and the current date is """ + str(date.today()) + """.
    If there was a previous conversation, here is the history: {chat_history}
    Respond to the question:
    Question: {input}""") | llama | StrOutputParser()

    # Prompt for Searching
    # Can also sub PromptTemplate for hub.pull("zac-dot/react-adjusted")
    react_prompt = PromptTemplate.from_template("""
    You are Learnix, an academic librarian who helps people academically.
    Answer questions the user gives as best as you can, giving as much information as possible when using the tools.
    You can use the tools up to 2 times before summarizing and giving your final answer.

    The current year is """ + str(date.today().year) + """ and the current date is """ + str(date.today()) + """.
    You have access to the following tools:

    {tools}

    To use a tool, please use the following format:

    ```
    Thought: Do I need to use a tool? Yes
    Action: the action to take, should be one of [{tool_names}]
    Action Input: the input to the action
    Observation: the result of the action
    ```
    
    When you have a response to say to the Human, or if you do not need to use a tool, you MUST use the format:
    
    ```
    Thought: Do I need to use a tool? No
    Final Answer: [your response here]
    ```

    Begin!
    
    Question: {input}
    Thought:{agent_scratchpad}
    """)

    # Prompt for Paper Searching
    # Can also sub out PromptTemplate for hub.pull("zac-dot/react-adjusted-papersearch")
    papersearch_prompt = PromptTemplate.from_template("""
    You are Learnix, an academic librarian who helps people academically.
    Answer the following questions as best you can.
    The current year is """ + str(date.today().year) + """ and the current date is """ + str(date.today()) + """.
    
    To use a tool, please use the following format:

    {tools}
    
    ```
    Thought: Do I need to use a tool? Yes
    Action: the action to take, should be one of [{tool_names}]
    Action Input: the input to the action
    Observation: the result of the action
    ```
    
    When you have a response to say to the Human, or if you do not need to use a tool, you MUST use the format:
    
    ```
    Thought: Do I need to use a tool? No
    Final Answer: [your response here]
    ```

    Begin!
    
    Question: {input}
    Thought:{agent_scratchpad}
    """)

    # DDG search tool
    search_wrapper = DuckDuckGoSearchAPIWrapper(max_results=3)
    search = DuckDuckGoSearchResults(api_wrapper=search_wrapper)
    search_tool = [
        Tool(
            name="DuckDuckGo",
            func=search.run,
            description="A search engine. Used to search the internet for current and up-to-date information."
                        "Action Input should be a search query. Output is a JSON array of the query results."
                        "Each time using this tool, the Action Input should be a different search query."
        ),
    ]

    # Arxiv search tool
    arxivsearch = load_tools(["arxiv"])
    # TBD: semantic scholar
    # semanticsearch = [SemanticScholarQueryRun()]

    # Agent creation
    search_agent = create_react_agent(llm=llama, tools=search_tool, prompt=react_prompt)
    research_agent = create_react_agent(llm=llama, tools=arxivsearch, prompt=papersearch_prompt)

    # Executors for each agent
    search_executor = AgentExecutor(agent=search_agent, tools=search_tool, verbose=True, return_intermediate_steps=True,
                                    max_iterations=5, handle_parsing_errors=True)
    research_executor = AgentExecutor(agent=research_agent, tools=arxivsearch, verbose=True,
                                      return_intermediate_steps=True, max_iterations=3, handle_parsing_errors=True)

    # Defining the routing chain
    router_chain = prompt | llama | StrOutputParser()

    # The routing logic
    def chain_decision(output):
        if output["action"] == "GENERAL" or output["action"] == "ANSWER":
            print("...thinking...\n")
            output["chat_history"] = router_memory.load_memory_variables({})
            temp_dict = {'input': output.get("input"), 'output': base_chain.invoke(output)}
            return temp_dict
        elif output["action"] == "SEARCH":
            print("...searching the web...\n")
            return search_executor
        elif output["action"] == "PAPER" or "PAPERSEARCH":
            print("...looking for papers or specific paper(s)...\n")
            return research_executor
        else:
            raise ValueError

    chain = RunnableMap({
        "action": router_chain,
        "input": lambda x: x["question"]
    }) | chain_decision

    # Initial question
    response = chain.invoke(
        {
            "question": question,
            "chat_history": router_memory.load_memory_variables({})
        }
    )

    router_memory.save_context({"input": response.get("input")}, {"output": response.get("input")})
    return response.get("output")
