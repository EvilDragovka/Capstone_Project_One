import requests
from config import AWSUrl
# /api/llama/llama_complete
userid = 1
url = f"http://localhost:5000/api/llama/llama_complete"
data = {
    "question": "What is the meaning of life?",
    "userid": userid
}

response = requests.post(url, json=data, timeout=200)
if response.status_code == 200:
    print(f"Success:", response.json())
else:
    print(f"Failure:", response)