import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_API_VERSION = '2023-05-15'
const MAX_RETRY_COUNT = 3
const RETRY_DELAY = 1000

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!apiKey) {
    return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 })
  }
  const body = await request.json()

  let retryCount = 0
  while (true) {
    let response = await chat(apiKey, body)
    const status = response.status
    if (status < 300 || (status >= 400 && status < 500)) {
      return response
    }
    if (retryCount >= MAX_RETRY_COUNT) {
      return response
    } else {
      retryCount++
      console.log(`Status is ${status}, Retry ${retryCount} times`)
      await delay(RETRY_DELAY)
    }
  }
}

async function chat(apiKey: string, body: any) {
  const [resourceId, mapping, azureApiKey, apiVersion] = apiKey.split(':')
  const model = body['model']

  // get deployment id
  let deploymentId
  if (mapping.includes('|')) {
    const modelMapping = Object.fromEntries(mapping.split(',').map((pair) => pair.split('|')))
    deploymentId = modelMapping[model] || Object.values(modelMapping)[0]
  } else {
    deploymentId = mapping
  }

  let url = `https://${resourceId}.openai.azure.com/openai/deployments/${deploymentId}/chat/completions?api-version=${
    apiVersion || DEFAULT_API_VERSION
  }`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'api-key': azureApiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  console.log(`[${resourceId}][${deploymentId}] ${response.status} ${response.statusText}`)
  let resultStream: ReadableStream | undefined
  let isFirstEventData = true
  const status: number = await new Promise((resolve) => {
    const decoder = new TextDecoder()
    resultStream = new ReadableStream(
      {
        async pull(controller) {
          const reader = response.body!.getReader()

          while (true) {
            const { value, done } = await reader.read()
            if (done) {
              controller.close()
            }
            let data = decoder.decode(value, { stream: true })
            if (isFirstEventData) {
              isFirstEventData = false
              if (shouldRetry(data)) {
                resolve(500)
              } else {
                resolve(response.status)
              }
            }
            controller.enqueue(value)
          }
        }
      },
      {
        highWaterMark: 1,
        size(chunk) {
          return chunk.length
        }
      }
    )
  })
  return new Response(resultStream, {
    status: status,
    headers: response.headers
  })
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function shouldRetry(data: string) {
  let shouldRetry = false
  try {
    const json = data.startsWith('data: ') ? data.match(/^data: (.*?)$/m)?.[1] : data
    const jobject = JSON.parse(json!!)
    if (
      jobject?.error?.message.startsWith('That model is currently overloaded with other requests')
    ) {
      shouldRetry = true
    }
  } catch (e) {
    console.error(`first event data string: ${data}`)
    console.error(`parse json error: ${e}`)
  }
  return shouldRetry
}
