import { describe, expect, it, vi } from 'vitest'
import { createRequestClient, RequestError } from '../src/request'

function createJsonResponse(data: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    headers: {
      'content-type': 'application/json',
    },
    status: 200,
    ...init,
  })
}

describe('create request client', () => {
  it('会序列化 GET query、注入 token，并通过 onResponse 解析响应', async () => {
    const fetchMock = vi.fn(async () => createJsonResponse({
      code: 0,
      data: {
        id: 'user-1',
      },
    }))

    const client = createRequestClient({
      baseURL: 'https://api.example.com',
      fetch: fetchMock,
      getToken: () => 'token-001',
      onResponse: ({ data }) => (data as { data: unknown }).data,
    })

    const result = await client.get('/users', {
      query: {
        keyword: 'Luma',
        page: 1,
      },
    })

    const [url, init] = fetchMock.mock.calls[0] ?? []
    const headers = new Headers(init?.headers)

    expect(String(url)).toBe('https://api.example.com/users?keyword=Luma&page=1')
    expect(init?.method).toBe('GET')
    expect(headers.get('Authorization')).toBe('Bearer token-001')
    expect(result).toEqual({
      id: 'user-1',
    })
  })

  it('会以 JSON 提交 POST body 并返回默认 JSON 响应', async () => {
    const fetchMock = vi.fn(async () => createJsonResponse({
      ok: true,
    }))

    const client = createRequestClient({
      baseURL: 'https://api.example.com',
      fetch: fetchMock,
    })

    const result = await client.post('/projects', {
      body: {
        name: 'Luma',
      },
    })

    const [, init] = fetchMock.mock.calls[0] ?? []
    const headers = new Headers(init?.headers)

    expect(init?.method).toBe('POST')
    expect(headers.get('content-type')).toBe('application/json')
    expect(init?.body).toBe(JSON.stringify({ name: 'Luma' }))
    expect(result).toEqual({
      ok: true,
    })
  })

  it('会拦截同一个仍在进行中的重复提交', async () => {
    let resolveFetch: ((response: Response) => void) | undefined
    const fetchMock = vi.fn(() => new Promise<Response>((resolve) => {
      resolveFetch = resolve
    }))

    const client = createRequestClient({
      baseURL: 'https://api.example.com',
      duplicateSubmit: true,
      fetch: fetchMock,
    })

    const firstRequest = client.post('/projects', {
      body: {
        name: 'Luma',
      },
    })
    const duplicateRequest = client.post('/projects', {
      body: {
        name: 'Luma',
      },
    })

    await expect(duplicateRequest).rejects.toMatchObject({
      code: 'DUPLICATE_REQUEST',
    })

    resolveFetch?.(createJsonResponse({ ok: true }))

    await expect(firstRequest).resolves.toEqual({
      ok: true,
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('状态码 401 时会触发会话过期回调并抛出 RequestError', async () => {
    const onSessionExpired = vi.fn()
    const fetchMock = vi.fn(async () => createJsonResponse({
      message: 'Unauthorized',
    }, {
      status: 401,
    }))

    const client = createRequestClient({
      baseURL: 'https://api.example.com',
      fetch: fetchMock,
      onSessionExpired,
    })

    await expect(client.get('/profile')).rejects.toBeInstanceOf(RequestError)
    await expect(client.get('/profile')).rejects.toMatchObject({
      status: 401,
    })
    expect(onSessionExpired).toHaveBeenCalledTimes(2)
  })
})
