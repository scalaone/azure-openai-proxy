# Azure OpenAI Proxy

[English](./README.en-US.md) | Simplified Chinese

Azure OpenAI Proxy is a tool that transforms OpenAI API requests into Azure OpenAI API requests. This allows applications that are compatible only with OpenAI to use Azure Open AI seamlessly.

## Prerequisites

To use Azure OpenAI Proxy, you need an Azure OpenAI account.

## Azure Deployment

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fscalaone%2Fazure-openai-proxy%2Fmain%2Fdeploy%2Fazure-deploy.json)

## Docker Deployment

Run the following command to deploy using Docker:

`docker run -d -p 3000:3000 scalaone/azure-openai-proxy`

## Local Execution and Testing (Command Line)

Follow the steps below:

1. Install NodeJS 18.
2. Clone the repository in the command line window.
3. Run `npm install` to install the dependencies.
4. Run `npm start` to start the application.
5. Use the script below for testing. Replace `AZURE_RESOURCE_ID`, `AZURE_MODEL_DEPLOYMENT`, and `AZURE_API_KEY` before executing. `AZURE_API_VERSION` is optional, its default value is `2023-05-15`.

<details>
<summary>Test script</summary>

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

</details>

## Tested Applications

The azure-openai-proxy has been tested and confirmed to work with the following applications:

| Application Name | Docker-compose File |
|------------------|---------------------|
| [chatbot-ui](https://github.com/mckaywrigley/chatbot-ui) | [docker-compose.yml](./e2e/chatbot-ui/docker-compose.yml) |
| [chatgpt-next-web](https://github.com/Yidadaa/ChatGPT-Next-Web) | [docker-compose.yml](./e2e/chatgpt-next-web/docker-compose.yml) |
| [chatgpt-web](https://github.com/Chanzhaoyu/chatgpt-web) | [docker-compose.yml](./e2e/chatgpt-web/docker-compose.yml) |
| [chatgpt-lite](https://github.com/blrchen/chatgpt-lite)  | [docker-compose.yml](./e2e/chatgpt-lite/docker-compose.yml) |
| [chatgpt-mininal](https://github.com/blrchen/chatgpt-mininal)  | [docker-compose.yml](./e2e/chatgpt-mininal/docker-compose.yml) |

To test locally, follow these steps:

1. Clone the repository in a command-line window.
2. Update the `OPENAPI_API_KEY` environment variable with `AZURE_RESOURCE_ID:AZURE_MODEL_DEPLOYMENT:AZURE_API_KEY`. Alternatively, update the OPENAPI_API_KEY value directly in the docker-compose.yml file.
3. Navigate to the directory containing the `docker-compose.yml` file for the application you want to test.
4. Run the build command: `docker-compose build`.
5. Start the service: `docker-compose up -d`.
6. Launch the application locally using the exposed port defined in the docker-compose.yml file. For example, visit http://localhost:3000.

## FAQs

<details>
<summary>Q: What are `AZURE_RESOURCE_ID`,`AZURE_MODEL_DEPLOYMENT`, and `AZURE_API_KEY`?

A: You can find these in the Azure management portal. Refer to the image below for details:

![resource-and-model](./resource-and-model.jpg)
</details>

<details>
<summary>Q: How can I use GPT-4?

A: To use GPT-4, use the key format as follows:

`AZURE_RESOURCE_ID:gpt-3.5-turbo|AZURE_MODEL_DEPLOYMENT,gpt-4|AZURE_MODEL_DEPLOYMENT,gpt-4-32k|AZURE_MODEL_DEPLOYMENT:AZURE_API_KEY:AZURE_API_VERSION`
</details>

## Contributing

We welcome various PR submissions.

## Disclaimer

This code is intended for demonstration and testing purposes only.