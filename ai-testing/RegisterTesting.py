import requests
# /api/llama/llama_complete
# Server ip is: 52.13.109.29, using flask locally use localhost:5000
userid = 1
url = f"http://localhost:5000/api/users/register"
data = {
    "username": "replaceme@replaceme.com",
    "password": "replaceme!Q1*",
    "email": "replaceme@replaceme.com"
}

response = requests.post(url, json=data, timeout=200)
print(response.status_code)
print(response.json())