import requests

#Contains POST /v1/completions HTTP/1.1 and
#Host: <DEPLOYMENT_URI> from API Reference
url = 'https://Llama2-70bchat-cscapstone-serverless.eastus2.inference.ai.azure.com/v1/chat/completions'

#Parses keys for APIs
#Created with Github Copilot
def getKeys(filename, name):
    with open(filename, 'r') as file:
        for line in file:
            words = line.split('=')
            if words[0] == name:
                return words[1].strip()


#APIs for Azure comes from file, rest comes from Environment Variables
azureKey = getKeys('key.txt', 'AZURE_API_KEY')

#Seting up compontents for LLM
systemrole = "You are a helpful assistant name Learnix. You are here to help people learn more about academics"

#Authorization: Bearer <TOKEN> and
#Content-type: application/json from API Reference
headers = {
    'Authorization': 'Bearer ' + azureKey,
    'Content-Type': 'application/json'
}

data = {
    "messages":
        [
            {
                "role": "system",
                "content": systemrole},
            {
                "role": "user",
                "content": "Hello, what an you do?"
            }
        ],
    "temperature": 0.8,
    "max_tokens": 256,
}

# POST request
response = requests.post(url, headers=headers, json=data)

# Print response
parsed_data = response.json()

#Accessing the response
print(parsed_data['choices'][0]['message']['content'])
#Printing out tokenss used
print("Total tokens used:", parsed_data['usage']['total_tokens'])
