# Azure OpenAI Proxy

English | [简体中文](./README.zh-CN.md)

Azure OpenAI Proxy is a tool that transforms OpenAI API requests into Azure OpenAI API requests, allowing OpenAI-compatible applications to seamlessly use Azure Open AI.

## Prerequisites

An Azure OpenAI account is required to use Azure OpenAI Proxy.

## Azure Deployment

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fscalaone%2Fazure-openai-proxy%2Fmain%2Fdeploy%2Fazure-deploy.json)

Remember to:

- Select the region that matches your Azure OpenAI resource for best performance.
- If deployment fails because the 'proxywebapp' name is already taken, change the resource prefix and redeploy.
- The deployed proxy app is part of a B1 pricing tier Azure web app plan, which can be modified in the Azure Portal after deployment.

## Docker Deployment

To deploy using Docker, execute the following command:

```bash
docker run -d -p 3000:3000 scalaone/azure-openai-proxy
```

## Local Execution and Testing

Follow these steps:

1. Install NodeJS 20.
2. Clone the repository in the command line window.
3. Run `npm install` to install the dependencies.
4. Run `npm start` to start the application.
5. Use the script below for testing. Replace `AZURE_RESOURCE_ID`, `AZURE_MODEL_DEPLOYMENT`, and `AZURE_API_KEY` before running. The default value for `AZURE_API_VERSION` is `2024-02-01` and is optional.

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

| Application Name                                                | Docker-compose File for E2E Test                                |
| --------------------------------------------------------------- | --------------------------------------------------------------- |
| [chatgpt-lite](https://github.com/blrchen/chatgpt-lite)         | [docker-compose.yml](./e2e/chatgpt-lite/docker-compose.yml)     |
| [chatgpt-minimal](https://github.com/blrchen/chatgpt-minimal)   | [docker-compose.yml](./e2e/chatgpt-minimal/docker-compose.yml)  |
| [chatgpt-next-web](https://github.com/Yidadaa/ChatGPT-Next-Web) | [docker-compose.yml](./e2e/chatgpt-next-web/docker-compose.yml) |
| [chatbot-ui](https://github.com/mckaywrigley/chatbot-ui)        | [docker-compose.yml](./e2e/chatbot-ui/docker-compose.yml)       |
| [chatgpt-web](https://github.com/Chanzhaoyu/chatgpt-web)        | [docker-compose.yml](./e2e/chatgpt-web/docker-compose.yml)      |


To test locally, follow these steps:

1. Clone the repository in a command-line window.
2. Update the `OPENAI_API_KEY` environment variable with `AZURE_RESOURCE_ID:AZURE_MODEL_DEPLOYMENT:AZURE_API_KEY`. Alternatively, update the OPENAI_API_KEY value in the docker-compose.yml file directly.
3. Navigate to the directory containing the `docker-compose.yml` file for the application you want to test.
4. Execute the build command: `docker-compose build`.
5. Start the service: `docker-compose up -d`.
6. Access the application locally using the port defined in the docker-compose.yml file. For example, visit http://localhost:3000.

## FAQs

<details>
<summary>Q: What are `AZURE_RESOURCE_ID`,`AZURE_MODEL_DEPLOYMENT`, and `AZURE_API_KEY`?</summary>
A: These can be found in the Azure management portal. See the image below for reference:
![resource-and-model](./docs/images/resource-and-model.jpg)
</details>
<details>
<summary>Q: How can I use gpt-4 and gpt-4-32k models?</summary>
A: To use gpt-4 and gpt-4-32k models, follow the key format below:
`AZURE_RESOURCE_ID:gpt-3.5-turbo|AZURE_MODEL_DEPLOYMENT,gpt-4|AZURE_MODEL_DEPLOYMENT,gpt-4-32k|AZURE_MODEL_DEPLOYMENT:AZURE_API_KEY:AZURE_API_VERSION`
</details>

## Contributing

We welcome all PR submissions.
