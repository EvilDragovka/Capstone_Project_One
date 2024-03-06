import sys

from langchain.chains import LLMChain
from langchain.memory import ConversationBufferWindowMemory
from langchain_community.chat_models.azureml_endpoint import AzureMLChatOnlineEndpoint, LlamaChatContentFormatter
from langchain_community.llms.azureml_endpoint import AzureMLEndpointApiType
from langchain_core.messages import SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder, HumanMessagePromptTemplate
from config import ConfigAzure


# LLM Model declaration
# Uses azure_key and AzureURL, throws it into AzureMLChatOnlineEndpoint which formats it to what
# Azure expects. Returns model
# DO NOT USE DIRECTLY IN FLASK
def llm():
    azure_key = ConfigAzure.azure_key
    url = 'https://Llama2-70bchat-cscapstone-serverless.eastus2.inference.ai.azure.com/v1/chat/completions'
    model = AzureMLChatOnlineEndpoint(
        endpoint_url=url,
        endpoint_api_type=AzureMLEndpointApiType.serverless,
        endpoint_api_key=azure_key,
        content_formatter=LlamaChatContentFormatter(),
        model_kwargs={"temperature": 0.8,
                      "max_tokens": 250},
        request_timeout=120,
    )
    return model


# Adjusted LLM
# Takes in temperature, max_tokens, and presence_penalty
# Temperature is creativity, max_tokens is the length of the response, and presence_penalty is the
# uniqueness of the response (from -2 to 2, higher being more unique)
def adjusted_llm(temperature: float, max_tokens: int, presence_penalty: float):
    azure_key = ConfigAzure.azure_key
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


# Prompt Template
# Used for basic conversations and for conversations
# Adjust the content as needed to change personality of AI, do not change MessagesPlaceholder
# or HumanMessagePromptTemplate
def prompt_template_no_history():
    prompt = ChatPromptTemplate.from_messages(
        [
            SystemMessage(
                content="""You are Learnix, with the main goal to help people with their academics and research.\n
                        If there was a previous conversation, here is the history: {chat_history}"""
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
    template = prompt_template_no_history()
    chat = LLMChain(llm=llama, prompt=template, verbose=False)
    response = chat.predict(user_input=question)
    return response


# Similar to conversation with llama
# Takes in question, temperature, max_tokens, and presence_penalty
# Adjusts the LLM model to the given parameters
def adjusted_conversation(question: str, temperature: float, max_tokens: int, presence_penalty: float):
    llama = adjusted_llm(temperature, max_tokens, presence_penalty)
    template = prompt_template()
    chat = LLMChain(llm=llama, prompt=template, verbose=False)
    response = chat.predict(user_input=question)
    return response
