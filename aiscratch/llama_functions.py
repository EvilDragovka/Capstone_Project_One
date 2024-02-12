import sys

from langchain.chains import LLMChain
from langchain.memory import ConversationBufferWindowMemory
from langchain_community.chat_models.azureml_endpoint import AzureMLChatOnlineEndpoint, LlamaChatContentFormatter
from langchain_community.llms.azureml_endpoint import AzureMLEndpointApiType
from langchain_core.messages import SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder, HumanMessagePromptTemplate


# Get API key from file
# (AI generated) Gets APIs and returns key
# View key.txt for apiname
def get_api_key(filename: str, apiname: str):
    try:
        with open(filename, 'r') as file:
            for line in file:
                words = line.split('=')
                if words[0] == apiname:
                    return words[1].strip()
    except FileNotFoundError:
        print("The API key was not found, check that the file exists and is in the proper location.")
        sys.exit(1)


# LLM Model declaration
# Uses azure_key and AzureURL, throws it into AzureMLChatOnlineEndpoint which formats it to what
# Azure expects. Returns model
def llm():
    azure_key = get_api_key('key.txt', 'AZURE_API_KEY')
    url = 'https://Llama2-70bchat-cscapstone-serverless.eastus2.inference.ai.azure.com/v1/chat/completions'
    model = AzureMLChatOnlineEndpoint(
        endpoint_url=url,
        endpoint_api_type=AzureMLEndpointApiType.serverless,
        endpoint_api_key=azure_key,
        content_formatter=LlamaChatContentFormatter(),
        model_kwargs={"temperature": 0.8,
                      "max_tokens": 512},
    )
    return model


# Adjusted LLM
# Takes in temperature, max_tokens, and presence_penalty
# Temperature is creativity, max_tokens is the length of the response, and presence_penalty is the
# uniqueness of the response (from -2 to 2, higher being more unique)
def adjusted_llm(temperature: float, max_tokens: int, presence_penalty: float):
    azure_key = get_api_key('key.txt', 'AZURE_API_KEY')
    url = 'https://Llama2-70bchat-cscapstone-serverless.eastus2.inference.ai.azure.com/v1/chat/completions'
    model = AzureMLChatOnlineEndpoint(
        endpoint_url=url,
        endpoint_api_type=AzureMLEndpointApiType.serverless,
        endpoint_api_key=azure_key,
        content_formatter=LlamaChatContentFormatter(),
        model_kwargs={"temperature": temperature,
                      "max_tokens": max_tokens,
                      "presence_penalty": presence_penalty},
    )
    return model


# Prompt Template
# Used for basic conversations and for conversations with memory
# Adjust the content as needed to change personality of AI, do not change MessagesPlaceholder
# or HumanMessagePromptTemplate
def prompt_template():
    prompt = ChatPromptTemplate.from_messages(
        [
            SystemMessage(
                content="""You are Learnix, with the main goal to help people with their academics and research.\n
                        If there was a previous conversation, here is the history: {chat_history}"""
            ),
            MessagesPlaceholder(
                variable_name="chat_history"
            ),
            HumanMessagePromptTemplate.from_template(
                "{user_input}"
            ),
        ]
    )
    return prompt


# Conversation with memory
# Takes in memory_key and question, returns response
# Uses LLMChain to generate the response, keeps the entry and answer in memory (volatile)
# memory_key is used to sort conversation memory, should be unique such as "username + chatnumber + date"
def conversation_with_memory(memory_key: str, question: str):
    llama = llm()
    template = prompt_template()
    memory = ConversationBufferWindowMemory(memory_key=memory_key, return_messages=True, k=5)
    chat = LLMChain(llm=llama, prompt=template, verbose=False, memory=memory)
    response = chat.predict(user_input=question)
    return response


# Basic conversation with llama
# Takes in question, returns response
# Essentially the same as talking directly to llama2-70bchat
def conversation(question: str):
    llama = llm()
    template = prompt_template()
    chat = LLMChain(llm=llama, prompt=template, verbose=False)
    response = chat.predict(user_input=question)
    return response
