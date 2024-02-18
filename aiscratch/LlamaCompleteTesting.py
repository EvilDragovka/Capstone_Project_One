from langchain.memory import ConversationBufferWindowMemory

from server.models.llama_complete import llama_complete

# Testing out llama_complete
# Update: this has to be initialized outside the llm, welp
# But it gives insight on how this exactly works
router_memory = ConversationBufferWindowMemory(k=5, memory_key="test")

print(llama_complete("What is the capital of France?", router_memory))
print(llama_complete("What did I previously ask you?", router_memory))
print(llama_complete("What is the capital of Texas?", router_memory))
print(llama_complete("What did I previously ask you?", router_memory))
print(llama_complete("Summarize what I've asked you so far.", router_memory))