import type { RequestClient, RequestClientOptions, RequestContext, RequestMethod, RequestOptions, RequestQuery } from './types'
import { RequestError } from './error'

/***********************URL 处理*********************/
function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url)
}

function joinBaseURL(baseURL: string | undefined, url: string): string {
  if (!baseURL || isAbsoluteUrl(url)) {
    return url
  }

  return `${baseURL.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`
}

function appendQuery(url: string, query: RequestQuery | undefined): string {
  if (!query) {
    return url
  }

  const requestUrl = new URL(url, isAbsoluteUrl(url) ? undefined : 'http://luma.local')

  Object.entries(query).forEach(([key, value]) => {
    const values = Array.isArray(value) ? value : [value]

    values.forEach((item) => {
      if (item !== undefined && item !== null) {
        requestUrl.searchParams.append(key, String(item))
      }
    })
  })

  if (isAbsoluteUrl(url)) {
    return requestUrl.toString()
  }

  return `${requestUrl.pathname}${requestUrl.search}${requestUrl.hash}`
}

/***********************请求体处理*********************/
function isPlainJsonBody(body: unknown): body is Record<string, unknown> | unknown[] {
  if (body === null || body === undefined) {
    return false
  }

  if (Array.isArray(body)) {
    return true
  }

  if (typeof body !== 'object') {
    return false
  }

  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    return false
  }

  if (typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams) {
    return false
  }

  if (typeof Blob !== 'undefined' && body instanceof Blob) {
    return false
  }

  if (typeof ArrayBuffer !== 'undefined' && body instanceof ArrayBuffer) {
    return false
  }

  return true
}

function resolveBody(method: RequestMethod, body: RequestOptions['body'], headers: Headers): BodyInit | null | undefined {
  if (method === 'GET' || body === undefined) {
    return undefined
  }

  if (isPlainJsonBody(body)) {
    if (!headers.has('content-type')) {
      headers.set('content-type', 'application/json')
    }

    return JSON.stringify(body)
  }

  return body as BodyInit | null
}

/***********************响应处理*********************/
async function readResponseData(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined
  }

  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

async function applyToken(headers: Headers, options: RequestClientOptions): Promise<void> {
  if (headers.has('Authorization') || !options.getToken) {
    return
  }

  const token = await options.getToken()

  if (token) {
    headers.set('Authorization', `${options.tokenPrefix ?? 'Bearer'} ${token}`)
  }
}

/***********************客户端创建*********************/
export function createRequestClient(clientOptions: RequestClientOptions = {}): RequestClient {
  const fetcher = clientOptions.fetch ?? globalThis.fetch
  const pendingKeys = new Set<string>()

  async function request<TResult = unknown>(url: string, options: RequestOptions = {}): Promise<TResult> {
    const method = options.method ?? 'GET'
    const resolvedUrl = appendQuery(joinBaseURL(clientOptions.baseURL, url), options.query)
    const headers = new Headers(options.headers)

    await applyToken(headers, clientOptions)

    const init: RequestInit = {
      headers,
      method,
      signal: options.signal,
    }
    init.body = resolveBody(method, options.body, headers)

    const duplicateKey = `${method}:${resolvedUrl}:${typeof init.body === 'string' ? init.body : ''}`

    if (clientOptions.duplicateSubmit && pendingKeys.has(duplicateKey)) {
      throw new RequestError('Duplicate request', {
        code: 'DUPLICATE_REQUEST',
      })
    }

    pendingKeys.add(duplicateKey)

    try {
      const response = await fetcher(resolvedUrl, init)
      const data = await readResponseData(response)
      const context: RequestContext = {
        data,
        init,
        response,
        url: resolvedUrl,
      }

      if (response.status === 401) {
        await clientOptions.onSessionExpired?.(context)
      }

      if (!response.ok) {
        throw new RequestError(response.statusText || `HTTP ${response.status}`, {
          data,
          response,
          status: response.status,
        })
      }

      if (clientOptions.onResponse) {
        return clientOptions.onResponse<TResult>(context)
      }

      return data as TResult
    }
    finally {
      pendingKeys.delete(duplicateKey)
    }
  }

  return {
    delete: (url, options) => request(url, { ...options, method: 'DELETE' }),
    get: (url, options) => request(url, { ...options, method: 'GET' }),
    patch: (url, options) => request(url, { ...options, method: 'PATCH' }),
    post: (url, options) => request(url, { ...options, method: 'POST' }),
    put: (url, options) => request(url, { ...options, method: 'PUT' }),
    request,
  }
}
