from time import sleep
import warnings
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferWindowMemory
from langchain_community.chat_models.azureml_endpoint import (AzureMLEndpointApiType,LlamaChatContentFormatter,AzureMLChatOnlineEndpoint)
from langchain.agents import AgentExecutor, LLMSingleActionAgent
import os

from langchain_community.utilities.google_search import GoogleSearchAPIWrapper
from langchain_core.tools import Tool
from CPTemplate import CustomPromptTemplate, CustomOutputParser


# Parses keys for APIs
# Created with Github Copilot
def get_keys(filename, name):
    with open(filename, 'r') as file:
        for line in file:
            words = line.split('=')
            if words[0] == name:
                return words[1].strip()


# Additional warnings for testing and debugging
warnings.filterwarnings("ignore", category=DeprecationWarning)


# APIs for Azure comes from file, rest comes from Environment Variables
azureKey = get_keys('key.txt', 'AZURE_API_KEY')

# Used for Google Search API
os.environ["GOOGLE_API_KEY"] = get_keys('key.txt', 'GOOGLE_API_KEY')
os.environ["GOOGLE_CSE_ID"] = get_keys('key.txt', 'GOOGLE_CSE_ID')
# Might add Tavaliy API & DuckDuckGo API depending on how easy it is to use with tools and LLMChain

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

# Tool Chain
search = GoogleSearchAPIWrapper()
tools = [
    Tool(
        name="Google Search",
        func=search.run,
        description="Use the tool to search the internet for up-to-date information."
    )
]

# Set up a prompt template which can interpolate the history
# Comes from OpenAI Cookbook
template_with_history = """You are Learnix, with the main goal to help people with their academics and research. 
Use tools when necessary, if you know the answer to the question without needing a tool then "Thought"
must be "I now know the final answer"

You have access to the following tools:

{tools}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take and must match the tool name, must be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin! Remember to give detailed, informative answers

Previous conversation history:
{history}

New question: {input}
{agent_scratchpad}"""

prompt_with_history = CustomPromptTemplate(
    template=template_with_history,
    tools=tools,
    input_variables=["input","intermediate_steps","history"]
)

Cake = LLMChain(llm=llama, prompt=prompt_with_history)
tool_names = [tool.name for tool in tools]
output_parser = CustomOutputParser()
agent = LLMSingleActionAgent(
    llm_chain=Cake,
    output_parser=output_parser,
    stop=["\nObservation:"],
    allowed_tools=tool_names
)

memory = ConversationBufferWindowMemory(k=2, return_messages=True)
agent_executor = AgentExecutor.from_agent_and_tools(agent=agent, tools=tools, verbose=True, memory=memory)

print("""
    Note: Do NOT ask questions that cannot be answered by the tools provided. (Ex: How are you?)
    Answers will only be provided if they can be factually proven
    Hit break or ctrl+c to stop the program in the event the verbose output is repeating too often
    This will be fixed in a different iteration with a better event Chain in place to stop this""")

# Wait for the user to read the note
sleep(8)

# Initial question
question = input("Ask a question: ")
response = agent_executor.run(question)
print(response)

while True:
    question = input("Ask another question: ")
    response = agent_executor.run(question)
    print(response)
