export type RequestMethod = 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT'

export type RequestQueryValue = boolean | number | string | null | undefined

export type RequestQuery = Record<string, RequestQueryValue | RequestQueryValue[]>

export interface RequestContext<TData = unknown> {
  data: TData
  init: RequestInit
  response: Response
  url: string
}

export interface RequestClientOptions<TData = unknown> {
  baseURL?: string
  duplicateSubmit?: boolean
  fetch?: typeof fetch
  getToken?: () => Promise<string | undefined> | string | undefined
  onResponse?: <TResult = unknown>(context: RequestContext<TData>) => Promise<TResult> | TResult
  onSessionExpired?: (context: RequestContext<TData>) => Promise<void> | void
  tokenPrefix?: string
}

export interface RequestOptions {
  body?: BodyInit | Record<string, unknown> | unknown[] | null
  headers?: HeadersInit
  method?: RequestMethod
  query?: RequestQuery
  signal?: AbortSignal
}

export interface RequestClient {
  delete: <TResult = unknown>(url: string, options?: Omit<RequestOptions, 'method'>) => Promise<TResult>
  get: <TResult = unknown>(url: string, options?: Omit<RequestOptions, 'body' | 'method'>) => Promise<TResult>
  patch: <TResult = unknown>(url: string, options?: Omit<RequestOptions, 'method'>) => Promise<TResult>
  post: <TResult = unknown>(url: string, options?: Omit<RequestOptions, 'method'>) => Promise<TResult>
  put: <TResult = unknown>(url: string, options?: Omit<RequestOptions, 'method'>) => Promise<TResult>
  request: <TResult = unknown>(url: string, options?: RequestOptions) => Promise<TResult>
}
