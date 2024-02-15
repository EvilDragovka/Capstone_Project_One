import os
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
from aiscratch.llama_functions import get_api_key
from langchain_community.tools.semanticscholar.tool import SemanticScholarQueryRun

# APIs for Azure comes from file, rest comes from Environment Variables
azureKey = get_api_key('key.txt', 'AZURE_API_KEY')
os.environ["TAVILY_API_KEY"] = get_api_key('key.txt', 'TAVILY_API_KEY')

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
     - If the question is a greeting or has "you","your", "Learnix", or "I", references you as an AI, then respond ONLY with 'GENERAL'
     - If the question needs more information and you want to search the web, and is not in your training set, respond ONLY with 'SEARCH'
     - If the question is about specific academic papers, meaning a DOI number or specific academic author, respond ONLY with 'PAPER'
     - If the question could be answered with some more information from academic papers, respond ONLY with 'PAPERSEARCH'
     - If you already have an answer or don't know which to respond to, respond ONLY with 'ANSWER'
    
    Question: {question}
    """
)

search_prompt = hub.pull("zac-dot/react-adjusted")
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
    prompt=search_prompt,
)

search_executor = AgentExecutor(agent=search_agent, tools=search_tool, verbose=True, return_intermediate_steps=True, max_iterations=4)

# Defining the routing chain
router_chain = prompt | llama | StrOutputParser()

# Base Chain
base_chain = PromptTemplate.from_template("""
Keep the answer down to 300 words max, but make sure to give a detailed answer.

Respond to the question:
Question: {input}""") | llama | StrOutputParser()

# The routing logic, cunt of it all
def chain_decision(output):
    if output["action"] == "GENERAL" or output["action"] == "ANSWER":
        print( "...thinking...\n")
        return base_chain
    elif output["action"] == "SEARCH":
        print("...searching the web...\n")
        return search_executor
    elif output["action"] == "PAPER":
        return "paper"
    elif output["action"] == "PAPERSEARCH":
        return "papersearch"
    else:
        raise ValueError

chain = RunnableMap({
    "action": router_chain,
    "input": lambda x: x["question"]
}) | chain_decision

# Initial question
question = input("Ask Learnix: ")
response = chain.invoke({"question": question})
print(response)

while True:
    question = input("Ask Learnix more: ")
    response = chain.invoke({"question": question})
    print(response)