# Azure-OpenAI-Proxy

Azure-OpenAI-Proxy is an application that serves as a proxy for OpenAI's API. It enables users to request AI-generated text completions for specific prompts, using different models and parameters. The proxy supports GPT-4 models in addition to other available models. It simplifies the interaction with the OpenAI API and helps manage multiple deployments with ease for your AI-based text generation applications.

## Installation

Follow these steps to set up Azure-OpenAI-Proxy:

1. Clone the repository:

```
git clone https://github.com/scalaone/azure-openai-proxy.git
```

2. Navigate to the project directory:

```
cd azure-openai-proxy
```

3. Install the required dependencies:

```
npm install
```

4. Replace the placeholder values in the example request as mentioned in the [Usage section](#usage) with your actual resource ID, deployment IDs, model names, and API key.

5. Run the application:

```
npm run start
```

The Azure-OpenAI-Proxy will be running on your server and listening for incoming requests.

## Usage

To send a request, use a `curl` command to POST the input data to the application's URL. Replace the placeholder values with your actual resource ID, deployment IDs, model names, and API key.

Example request:

```
curl -X "POST" "https://openaiproxy2.azurewebsites.net/v1/chat/completions" \
     -H 'Authorization: Bearer YOUR_RESOURCE_ID:YOUR_MODEL_NAME_IDENTIFIERS:YOUR_API_KEY' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "messages": [
    {
      "content": "hi",
      "role": "user"
    }
  ],
  "temperature": 1,
  "model": "gpt-3.5-turbo",
  "stream": false
}'
```

Replace the following placeholder values:

- `YOUR_RESOURCE_ID` with the actual resource ID (e.g., `hai`).
- `YOUR_MODEL_NAME_IDENTIFIERS` with the actual model and deployment ID mappings (e.g., `gpt-3.5-turbo|gpt-35-turbo,gpt-4|gpt-4,gpt-4-32k|gpt-4-32k`).
- `YOUR_API_KEY` with your actual API key (e.g., `xxxxxx`).

## Parameters

The request body contains the following parameters:

- `messages`: An array of message objects containing `content` and `role` properties. The `content` represents the text input, and the `role` can be one of the following options: `'system'`, `'user'`, or `'assistant'`.
- `temperature`: Controls the randomness of generated completions. Higher values (e.g., 1) result in more random responses, while lower values (e.g., 0.1) produce more focused and deterministic responses.
- `model`: Specifies the AI model to be used for generating completions. In the example, it is set to `'gpt-3.5-turbo'`.
- `stream`: A boolean value indicating whether the response should be streamed.

## License

This project is licensed under the MIT License. See the [LICENSE](https://choosealicense.com/licenses/mit/) file for details.

## Contributing

Contributions to Azure-OpenAI-Proxy are greatly appreciated. To contribute, follow these steps:

1. Fork the repository and create your branch.
2. Make changes or additions to the code.
3. Commit your changes and raise a Pull Request.

Please make sure to follow the project's coding standards and update documentation accordingly.

For further information, check the [OpenAI API documentation](https://platform.openai.com/docs/api-reference/completions/create).

Thank you for your interest in contributing to Azure-OpenAI-Proxy. Your efforts will help improve the project and benefit the community.