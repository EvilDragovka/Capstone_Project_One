from langchain.memory import ConversationBufferWindowMemory
from server.models.llama_complete import llama_complete
import warnings
import requests
# Ignore warnings, mainly telling you how to use the APIs
warnings.simplefilter(action='ignore', category=Warning)

# Adds colors to mark questions asked versus answers given
# https://stackoverflow.com/questions/287871/print-in-terminal-with-colors-using-python
class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

userid = 1
url = f"http://52.13.109.29/api/queries/{userid}"
data = {
    "question": "What is the meaning of life?",
    "response": "It is what you make of it"

}
response = requests.post(url, json=data)
if response.status_code == 200:
    print(f"{bcolors.OKGREEN}Success:{bcolors.ENDC}", response)
else:
    print(f"{bcolors.FAIL}Failure: {bcolors.ENDC}", response)

# Test history retrerival
print(f"{bcolors.OKGREEN}Prompt: What questions have I asked you?{bcolors.ENDC}")
print(llama_complete("What questions have I asked you?", 1))
