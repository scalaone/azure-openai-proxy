import { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ChatMessage } from '@/pages/api/chat/interface'
import logger from 'winston'

logger.add(
  new logger.transports.Console({
    format: logger.format.simple()
  })
)

const DEFAULT_API_VERSION = '2023-05-15'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' })
    return
  }

  const { authorization } = req.headers
  const apiKey = authorization?.replace('Bearer ', '')
  if (!apiKey) {
    res.status(401).json({ message: 'Error: Authorization value missing in header.' })
    return
  }

  const [resourceId, deploymentId, azureApiKey, apiVersion = DEFAULT_API_VERSION] =
    apiKey.split(':')
  logger.info(
    `resourceId: ${resourceId}, deploymentId: ${deploymentId}, azureApiKey: ${azureApiKey}`
  )

  const endpoint = `https://${resourceId}.openai.azure.com`
  const stream = req.body['stream']
  const openaiResponse = await getCompletions(
    endpoint,
    deploymentId,
    azureApiKey,
    req.body,
    stream,
    apiVersion
  )

  if (!openaiResponse) {
    res.status(500).json({ message: 'Error: Failed to retrieve response from Azure OpenAI.' })
    return
  }

  for (const [key, value] of Object.entries(openaiResponse.headers)) {
    res.setHeader(key, value)
  }

  if (openaiResponse.status >= 200 && openaiResponse.status < 300) {
    if (stream) {
      res.status(openaiResponse.status)
      handleStreamResponse(res, openaiResponse.data)
    } else {
      res.status(openaiResponse.status).send(openaiResponse.data)
    }
  } else {
    res.status(openaiResponse.status).send(openaiResponse.data)
    logger.error(
      `The OpenAI has returned an error with status code ${openaiResponse.status} and message ${openaiResponse.statusText}`
    )
  }
}

const handleStreamResponse = (res: NextApiResponse, streamData: any) => {
  streamData.on('data', (data: Buffer) => {
    const decodedData = data.toString('utf8')
    if (decodedData.includes('data: [DONE]')) {
      res.write(`${decodedData}\n`)
    } else {
      res.write(data)
    }
  })

  streamData.on('end', () => {
    res.end()
  })
}

const getCompletions = async (
  endpoint: string,
  deploymentId: string,
  azureApiKey: string,
  body: any,
  stream: boolean,
  apiVersion: string
): Promise<AxiosResponse | undefined> => {
  const deploymentMapping = getDeploymentMapping(deploymentId, body['model'])
  const url = `${endpoint}/openai/deployments/${deploymentMapping}/chat/completions?api-version=${apiVersion}`
  const headers = {
    'api-key': azureApiKey,
    'Content-Type': 'application/json'
  }
  const config: AxiosRequestConfig = { headers }

  if (stream) {
    config['responseType'] = 'stream'
  }

  try {
    return await axios.post(url, body, config)
  } catch (error) {
    logger.error(`Error in getCompletions: ${error}`)
    return (error as AxiosError).response
  }
}

const getDeploymentMapping = (deploymentId: string, model?: string): string => {
  if (!deploymentId.includes(',')) {
    return deploymentId
  }

  const modelMapping = deploymentId
    .split(',')
    .reduce((acc: Record<string, string>, pair: string) => {
      const [key, value] = pair.split('|')
      acc[key] = value
      return acc
    }, {})

  if (!model) {
    return Object.values(modelMapping)[0]
  }

  return modelMapping[model] || Object.values(modelMapping)[0]
}

export default handler
