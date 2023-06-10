# Azure OpenAI Proxy

[English](./README.en-US.md) | Simplified Chinese

An Azure OpenAI API proxy tool that can convert OpenAI API requests into Azure OpenAI API requests, allowing applications that only support OpenAI to seamlessly use Azure Open AI.

## Usage Requirements

You must have an Azure OpenAI account to use the Azure OpenAI Proxy.

## Deploy to Azure

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fscalaone%2Fazure-openai-proxy%2Fmain%2Fdeploy%2Fazure-deploy.json)

## Docker Deployment

`docker run -d -p 3000:3000 scalaone/azure-openai-proxy`

## Local Running and Testing, Command Line Method

1. Install NodeJS 18.
2. Clone the code in the command line window.
3. Run `npm install` to install dependencies.
4. Run `npm start` to start the application.
5. Run the script below for testing, replacing `AZURE_RESOURCE_ID`, `AZURE_MODEL_DEPLOYMENT`, and `AZURE_API_KEY` before running it, `AZURE_API_VERSION` is optional and the default value is `2023-03-15-preview`.
```bash
curl -X "POST" "http://localhost:3000/v1/chat/completions" \
-H 'Authorization: AZURE_RESOURCE_ID:AZURE_MODEL_DEPLOYMENT:AZURE_API_KEY:AZURE_API_VERSION' \
-H 'Content-Type: application/json; charset=utf-8' \
-d $'{
  "messages": [
    {
      "role": "system",
      "content": "You are an AI assistant that helps people find information."
    },
    {
      "role": "user",
      "content": "hi."
    }
  ],
  "temperature": 1,
  "model": "gpt-3.5-turbo",
  "stream": false
}'
```

## App has been tested

The following apps have been tested and confirmed to work with the azure-openai-proxy:

| App Name         | E2E Docker-compose file | 
|------------------|-------------------------|
| [chatbot-ui](https://github.com/mckaywrigley/chatbot-ui) | [docker-compose.yml](./e2e/chatbot-ui/docker-compose.yml) |
| [chatgpt-next-web](https://github.com/Yidadaa/ChatGPT-Next-Web) | [docker-compose.yml](./e2e/chatgpt-next-web/docker-compose.yml) |
| [chatgpt-web](https://github.com/Chanzhaoyu/chatgpt-web) | [docker-compose.yml](./e2e/chatgpt-web/docker-compose.yml) |
| [chatgpt-lite](https://github.com/blrchen/chatgpt-lite)  | [docker-compose.yml](./e2e/chatgpt-lite/docker-compose.yml) |
| [chatgpt-mininal](https://github.com/blrchen/chatgpt-mininal)  | [docker-compose.yml](./e2e/chatgpt-mininal/docker-compose.yml) |

To run a test locally, please follow these steps:

1. Clone the code in a command-line window.
2. Update the environment variable `OPENAPI_API_KEY` with `AZURE_RESOURCE_ID:AZURE_MODEL_DEPLOYMENT:AZURE_API_KEY`. Alternatively, you can update the OPENAPI_API_KEY value directly in the docker-compose.yml file.
3. Navigate to the directory containing the `docker-compose.yml` file for the app you want to test.
4. Execute the build command: `docker-compose build`.
5. Start the service: `docker-compose up -d`.
6. Based on the exposed port defined in the docker-compose.yml file, launch the app to test it locally. For example, visit http://localhost:3000.

## Frequently Asked Questions

Q: What is `AZURE_RESOURCE_ID`,`AZURE_MODEL_DEPLOYMENT`,`AZURE_API_KEY`?

A: It can be found in azure management portal, see image below for details:

![resource-and-model](./resource-and-model.jpg)

Q: How do I support GPT-4？

A: To use GPT-4, please use key format as follows:

`AZURE_RESOURCE_ID:gpt-3.5-turbo|AZURE_MODEL_DEPLOYMENT,gpt-4|AZURE_MODEL_DEPLOYMENT,gpt-4-32k|AZURE_MODEL_DEPLOYMENT:AZURE_API_KEY:AZURE_API_VERSION`

# How To Contribute Code?

Welcome to submit various PRs.

# Disclaimer

This code is for demonstration and testing purposes only.