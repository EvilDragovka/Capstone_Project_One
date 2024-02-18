import os
from datetime import date
from langchain import hub
from langchain.agents import AgentExecutor, load_tools, create_react_agent
from langchain.schema.runnable.base import RunnableMap
from langchain_community.chat_models.azureml_endpoint import AzureMLChatOnlineEndpoint, LlamaChatContentFormatter
from langchain_community.llms.azureml_endpoint import AzureMLEndpointApiType
from langchain_community.tools.ddg_search.tool import DuckDuckGoSearchResults
from langchain_community.utilities.duckduckgo_search import DuckDuckGoSearchAPIWrapper
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.tools import Tool
from langsmith import Client
from server.service.llama_functions import get_api_key
from langchain_community.tools.semanticscholar.tool import SemanticScholarQueryRun
from langchain.memory import ConversationBufferWindowMemory

# APIs for Azure comes from file, rest comes from Environment Variables
azureKey = get_api_key('key.txt', 'AZURE_API_KEY')
url = 'https://Llama2-70bchat-cscapstone-serverless.eastus2.inference.ai.azure.com/v1/chat/completions'

# LLM Model declaration
llama = AzureMLChatOnlineEndpoint(
    endpoint_url=url,
    endpoint_api_type=AzureMLEndpointApiType.serverless,
    endpoint_api_key=azureKey,
    content_formatter=LlamaChatContentFormatter(),
    model_kwargs={"temperature": 0.8, "max_tokens": 1024},
    streaming=True
)

#Langsmith tracking
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_ENDPOINT"] = "https://api.smith.langchain.com"
os.environ["LANGCHAIN_API_KEY"] = "ls__de882389727f48219891d9e0849bc26b"
os.environ["LANGCHAIN_PROJECT"] = "Llama2-70bchat-testing"
client = Client()

# Prompt template for conversation start, and all prompts needed
prompt = PromptTemplate.from_template("""
    You are called Learnix, with the main goal to help people with their academics and research.
    Choose one of the following actions:
     - If the question is a greeting or has "you","your", "Learnix", or "I", references you as an AI, then respond ONLY
      with 'GENERAL'
     - If the question needs more information and you want to search the web and uses words such as "recent", "current",
      or time / day of the year, and is not in your training set, respond ONLY with 'SEARCH'
     - If the question is about specific academic papers, meaning a DOI number (ex: 1888.083919) or specific academic author, respond ONLY
      with 'PAPER'
     - If the question could be answered with some more information from academic papers, respond ONLY with 'PAPERSEARCH'
     - If you already have an answer or don't know which to respond to, respond ONLY with 'ANSWER'
     - If you don't know the answer and don't choose any previous options, respond ONLY with 'GENERAL'
    
    If there was a previous conversation, here is the history: {chat_history}
    Question: {question}
    """
)

react_prompt = hub.pull("zac-dot/react-adjusted")
papersearch_prompt = hub.pull("zac-dot/react-adjusted-papersearch")

# Memory Declaration
memkey = "default" #Change when being used in final project
router_memory = ConversationBufferWindowMemory(k=5) #volatile

# Tools declaration
#DDG search tool
search_wrapper = DuckDuckGoSearchAPIWrapper(region="us", max_results=3)
search = DuckDuckGoSearchResults(api_wrapper=search_wrapper)
search_tool = [
    Tool(
        name="DuckDuckGo",
        func=search.run,
        description="Use the tool to search the internet for up-to-date information."
    ),
]

# Arxiv search tool, and semantic scholar
arxivsearch = load_tools(["arxiv"])
semanticsearch = [SemanticScholarQueryRun()]

search_agent = create_react_agent(
    llm=llama,
    tools=search_tool,
    prompt=react_prompt,
)

research_agent = create_react_agent(
    llm=llama,
    tools=arxivsearch,
    prompt=papersearch_prompt,
)

search_executor = AgentExecutor(agent=search_agent, tools=search_tool, verbose=True, return_intermediate_steps=True, max_iterations=4)
research_executor = AgentExecutor(agent=research_agent, tools=arxivsearch, verbose=True, return_intermediate_steps=True, max_iterations=2, handle_parsing_errors=True)
# Defining the routing chain
router_chain = prompt | llama | StrOutputParser()

# Base Chain
base_chain = PromptTemplate.from_template("""
You are called Learnix, but do not mention yourself, with the main goal to help people with their academics and research.
Keep the answer under 300 words max, but make sure to give a detailed answer.
The current year is""" + str(date.today().year) + """ and the current date is """ + str(date.today()) + """.
If there was a previous conversation, here is the history: {chat_history}
Respond to the question:
Question: {input}""") | llama | StrOutputParser()


# The routing logic, cunt of it all
def chain_decision(output):
    if output["action"] == "GENERAL" or output["action"] == "ANSWER":
        print( "...thinking...\n")
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
question = input("Ask Learnix: ")
response = chain.invoke(
    {
        "question": question,
        "chat_history": router_memory.load_memory_variables({})
    }
)

router_memory.save_context({"input": response.get("input")}, {"output": response.get("input")})
print(response.get("input"))
print(response.get("output"))

while True:
    question = input("Ask Learnix more: ")
    response = chain.invoke(
        {
            "question": question,
            "chat_history": router_memory.load_memory_variables({})
        }
    )
    router_memory.save_context({"input": response.get("input")}, {"output": response.get("input")})
    print(response.get("input"))
    print(response.get("output"))
