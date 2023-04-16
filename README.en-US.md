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
5. Run the script below for testing, replacing `YOUR_RESOURCE_ID`, `YOUR_MODEL_DEPLOYMENT`, and `YOUR_API_KEY` before running it, `AZURE_API_VERSION` is optional and the default value is `2023-03-15-preview`.
```bash
curl -X "POST" "http://localhost:3000/v1/chat/completions" \
-H 'Authorization: YOUR_RESOURCE_ID:YOUR_MODEL_DEPLOYMENT:YOUR_API_KEY:AZURE_API_VERSION' \
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

## Local Running and Testing, Using WebChat for Streaming Test

1. Clone code in command line window
2. Update environment variable of OPENAPI_API_KEY on line nine of `docker-compose.yml` file with `YOUR_RESOURCE_ID:YOUR_MODEL_DEPLOYMENT:YOUR_API_KEY`
3. Execute build: `run docker-compose build`
4. Start service: `run docker-compose up -d`
5. Launch `http://localhost:3000`

## Frequently Asked Questions

Q: What is `YOUR_RESOURCE_ID`,`YOUR_MODEL_DEPLOYMENT`,`YOUR_API_KEY`?

A: It can be found in azure management portal, see image below for details:

![resource-and-model](./resource-and-model.jpg)

Q: How do I support GPT-4？

A: To use GPT-4, please use key format as follows:

`YOUR_RESOURCE_ID:gpt-3.5-turbo|YOUR_MODEL_DEPLOYMENT,gpt-4|YOUR_MODEL_DEPLOYMENT,gpt-4-32k|YOUR_MODEL_DEPLOYMENT:YOUR_API_KEY:AZURE_API_VERSION`

# How To Contribute Code?

Welcome to submit various PRs.

# Disclaimer

This code is for demonstration and testing purposes only.