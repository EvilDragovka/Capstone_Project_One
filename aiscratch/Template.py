import os
from langchain_community.chat_models.azureml_endpoint import AzureMLChatOnlineEndpoint, LlamaChatContentFormatter
from langchain_community.llms.azureml_endpoint import AzureMLEndpointApiType
from langsmith import Client

import config
from config import ConfigAzure

# APIs for Azure comes from file, rest comes from Environment Variables
azureKey = ConfigAzure.azure_key

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
os.environ["LANGCHAIN_PROJECT"] = "Llama2-70bchat-cscapstone"
client = Client()