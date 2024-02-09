from langchain.chains import LLMChain
from langchain.memory import ConversationBufferWindowMemory
from langchain.prompts import HumanMessagePromptTemplate
from langchain_community.chat_models.azureml_endpoint import (AzureMLEndpointApiType,LlamaChatContentFormatter,AzureMLChatOnlineEndpoint)
from langchain_core.messages import SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

#Parses keys for APIs
#Created with Github Copilot
def getKeys(filename, name):
    with open(filename, 'r') as file:
        for line in file:
            words = line.split('=')
            if words[0] == name:
                return words[1].strip()

#APIs for Azure comes from file
azureKey = getKeys('key.txt', 'AZURE_API_KEY')
url = 'https://Llama2-70bchat-cscapstone-serverless.eastus2.inference.ai.azure.com/v1/chat/completions'

#Seting up compontents for LLM
llama = AzureMLChatOnlineEndpoint(
    endpoint_url=url,
    endpoint_api_type=AzureMLEndpointApiType.serverless,
    endpoint_api_key=azureKey,
    content_formatter=LlamaChatContentFormatter(),
    model_kwargs={"temperature": 0.8, "max_tokens": 512},
)

#Main template for chatting
chat_template = ChatPromptTemplate.from_messages(
    [
        SystemMessage(
                content ="You are a helpful assistant name Learnix. You are here to help people learn more about academics."
                "Previous conversation: {chat_history}"
        ),
        MessagesPlaceholder(
            variable_name="chat_history"
        ),
        HumanMessagePromptTemplate.from_template(
            "{user_input}"
        ),
    ]
)

#Memory for the chat
memory = ConversationBufferWindowMemory(memory_key="chat_history", return_messages=True, k=5)
conversation = LLMChain(
    llm=llama,
    prompt=chat_template,
    verbose=False,
    memory=memory,
)

# Initial question
question = input("Ask a question: ")
response = conversation.predict(user_input=question)
print(response)

while True:
    question = input("Ask another question: ")
    response = conversation.predict(user_input=question)
    print(response)

