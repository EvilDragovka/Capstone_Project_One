from langchain import hub
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferWindowMemory
from langchain.prompts import HumanMessagePromptTemplate
from langchain_community.chat_models.azureml_endpoint import (AzureMLEndpointApiType,LlamaChatContentFormatter,AzureMLChatOnlineEndpoint)
from langchain_core.messages import SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.tools import Tool
from langchain_community.utilities import GoogleSearchAPIWrapper
from langchain.agents import create_structured_chat_agent, AgentExecutor, AgentType, initialize_agent
import os

#Parses keys for APIs
#Created with Github Copilot
def getKeys(filename, name):
    with open(filename, 'r') as file:
        for line in file:
            words = line.split('=')
            if words[0] == name:
                return words[1].strip()


#APIs for Azure comes from file, rest comes from Environment Variables
azureKey = getKeys('../key.txt', 'AZURE_API_KEY')

#Used for Google Search API
os.environ["GOOGLE_API_KEY"] = getKeys('../key.txt', 'GOOGLE_API_KEY')
os.environ["GOOGLE_CSE_ID"] = getKeys('../key.txt', 'GOOGLE_CSE_ID')
# Might add Tavaliy API & DuckDuckGo API depending on how easy it is to use with tools and LLMChain

url = 'https://Llama2-70bchat-cscapstone-serverless.eastus2.inference.ai.azure.com/v1/chat/completions'

#LLM Model declaration
llama = AzureMLChatOnlineEndpoint(
    endpoint_url=url,
    endpoint_api_type=AzureMLEndpointApiType.serverless,
    endpoint_api_key=azureKey,
    content_formatter=LlamaChatContentFormatter(),
    model_kwargs={"temperature": 0.8, "max_tokens": 512},
    streaming=True
)

#Prompt to use, will be adjusted
base_prompt = ChatPromptTemplate.from_messages(
    [
        SystemMessage(
            content ="""You are a helpful assistant name Learnix, who is an academic librarian.\n
                     You are here to help students with their research and to provide them with the tools they need to succeed.\n
                     If you are unable to find an answer in your knowledge base, you can use your available tools to search the web.\n
                     
                     If there was a previous conversation, here is the history: {chat_history}\n
                     
                     Your scratchpad for notes: {agent_scratchpad}\n
                     
                     Names of available tools: {tool_names}\n
                     
                     Tools that are available: {tools}\n
                     """
        ),
        MessagesPlaceholder(
            variable_name="chat_history"
        ),
        MessagesPlaceholder(
            variable_name="agent_scratchpad"
        ),
        MessagesPlaceholder(
            variable_name="tool_names"
        ),
        MessagesPlaceholder(
            variable_name="tools"
        ),
        HumanMessagePromptTemplate.from_template(
            "{user_input}",
        ),

    ]
)

# Definitions for the Google Search API
search = GoogleSearchAPIWrapper()
def results_google(query):
    return search.results(query, 5)

tools = [
    Tool(
        name="Google Search",
        description="Searches the web for information",
        func=results_google,
    )
]

tool_names = [tool.name for tool in tools]

#Agent initialization and creation
agent = create_structured_chat_agent(
    llama,
    tools,
    base_prompt,
)

agent_executor = AgentExecutor(
    agent=agent, tools=tools, verbose=True, handle_parsing_errors=True
)

# Chat Memory Chain, for complete output of entire response use verbose=True
memory = ConversationBufferWindowMemory(memory_key="history_a1", return_messages=True, k=5)
chat_history = memory.load_memory_variables(inputs={}).get("history_a1", [])

#
# Question asking / answering portion
#
question = input("Ask a question: ")
response = agent_executor.invoke({"user_input": question, "chat_history": chat_history})

print(response)

while True:
    question = input("Ask another question: ")
    response = agent_executor.invoke({"user_input": question, "chat_history": chat_history})
    print(response)
