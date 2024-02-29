from langchain.memory import ConversationBufferWindowMemory

from server.models.llama_complete import llama_complete
import warnings
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

# Testing out llama_complete, consists of 10 things
# Update: this has to be initialized outside the llm, welp
# But it gives insight on how this exactly works
router_memory = ConversationBufferWindowMemory(k=5, memory_key="test", return_messages=True)

# Average Latency: 12.56s, at max 26s, absolute limit is 60s
# Typially 8 out of 10 are answered, 2 are not / get stuck in a slight
# loop as when using search it does not always parse information

# Testing out geography information
print(f"{bcolors.OKGREEN}Prompt: What is the captial of France?{bcolors.ENDC}")
print(llama_complete("What is the capital of France?", router_memory))
# Testing memory
print(f"{bcolors.OKGREEN}Prompt: What did I previously ask you?{bcolors.ENDC}")
print(llama_complete("What did I previously ask you?", router_memory))
# Testing out summarization of a topic
print(f"{bcolors.OKGREEN}Prompt: What papers have Florent Renaud published on arxiv?{bcolors.ENDC}")
print(llama_complete("What papers have Florent Renaud published on arxiv?", router_memory))
# Testing out searching of a academic topic on arxiv
print(f"{bcolors.OKGREEN}Prompt: What does the paper 1605.08386?{bcolors.ENDC}")
print(llama_complete("What does the paper 1605.08386 say?", router_memory))
# Testing out searching recent information
print(f"{bcolors.OKGREEN}Prompt: Who won the most recent super bowl?{bcolors.ENDC}")
print(llama_complete("Who won the most recent super bowl?", router_memory))
# Testing out recent information
print(f"{bcolors.OKGREEN}Prompt: When was Animal Crossing New Horizons released?{bcolors.ENDC}")
print(llama_complete("When was Animal Crossing New Horizons released?", router_memory))
# Testing out summarization of a topic
print(f"{bcolors.OKGREEN}Prompt: What is the history of the United States?{bcolors.ENDC}")
print(llama_complete("What is the history of the United States?", router_memory))
# Testing out memory
print(f"{bcolors.OKGREEN}Prompt: What were the last two things i asked you?{bcolors.ENDC}")
print(llama_complete("What were the last two things i asked you?", router_memory))
