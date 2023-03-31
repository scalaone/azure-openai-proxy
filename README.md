Azure OpenAI Proxy

A Node.js API proxy that connects to the OpenAI API using your Azure credentials. This proxy is useful when working with OpenAI as it allows you to keep your API key secure and manage authentication from a centralized location.

Features

• Connects to the OpenAI GPT-3 API using your Azure credentials
• Handles access token refresh and error retries
• Works as a local HTTP proxy that forwards requests to OpenAI

Installation

To install and use this package, you must have Node.js and npm installed on your machine.

1. Clone this repository to your local machine
2. Navigate to the project’s root directory
3. Run the following command to install the required dependencies:

npm install

Usage

Before running this application, you must [create an Azure Active Directory application](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app) and [configure it to access the OpenAI API](https://learn.microsoft.com/en-us/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps).

Once you have your Azure credentials, you can start the proxy server using the following command:

npm start

This starts the proxy server on localhost:3000. You can now send requests to the OpenAI API using the proxy server.

// Send a GPT-3 request using the OpenAI API
```
curl -X "POST" "http://localhost:3000/v1/chat/completions" \
     -H 'Authorization: Bearer ${resource_id}:${deployment_id}:{azure_openai_apikey}' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "model": "gpt-3.5-turbo",
  "temperature": 1,
  "messages": [
    {
      "content": "Please edit my sentences",
      "role": "system"
    },
    {
      "content": "spends time with my family",
      "role": "user"
    },
    {
      "content": "I spend time with my family.",
      "role": "assistant"
    },
    {
      "content": "spends time with my family",
      "role": "user"
    }
  ]
}'
```

Note that you can replace davinci with other OpenAI models that you have access to.

API Documentation

The API documentation can be found in the docs folder in the project’s root directory.

Roadmap

• Add authentication with client secret instead of client credentials
• Add support for other OpenAI APIs
• Add caching to improve performance

Authors

• Hai Chang (@haha1903)

Acknowledgements

• This project was inspired by the [Azure OpenAI API Proxy](https://github.com/haha1903/azure-openai-proxy).

Contributing

Contributions are always welcome! For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

License

[MIT](https://choosealicense.com/licenses/mit/)