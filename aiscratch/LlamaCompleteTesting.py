from langchain.memory import ConversationBufferWindowMemory

from server.models.llama_complete import llama_complete

# Testing out llama_complete
# Update: this has to be initialized outside the llm, welp
# But it gives insight on how this exactly works
router_memory = ConversationBufferWindowMemory(k=5, memory_key="test", return_messages=True)

# Testing out geography information
# Awnsers via llama model
print(llama_complete("What is the capital of France?", router_memory))
# Testing memory
# Awnsers via llama model
print(llama_complete("What did I previously ask you?", router_memory))
# Testing out summarization of a topic
# Just awnsers via llama model
print(llama_complete("What papers have Florent Renaud published on arxiv?", router_memory))
# Testing out searching of a academic topic on arxiv
# Uses ARXIV, but fails to summarize
print(llama_complete("What does the paper 1605.08386 say?", router_memory))
# Testing out searching recent information
# Awnsers it via DDG, 50/50 on awnsering it
print(llama_complete("Who won the most recent super bowl?", router_memory))
