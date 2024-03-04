import requests
# /api/llama/llama_complete
# Server ip is: 52.13.109.29, using locally use localhost:5000
userid = 1
url = f"http://52.13.109.29/api/llama/llama_complete"
data = {
    "question": "What is the meaning of life?",
    "userid": userid
}

response = requests.post(url, json=data, timeout=200)
if response.status_code == 200:
    print(f"Success:", response.json())
else:
    print(f"Failure:", response)