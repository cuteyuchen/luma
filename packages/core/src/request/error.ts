export interface RequestErrorOptions {
  code?: string
  data?: unknown
  response?: Response
  status?: number
}

export class RequestError extends Error {
  code?: string
  data?: unknown
  response?: Response
  status?: number

  constructor(message: string, options: RequestErrorOptions = {}) {
    super(message)
    this.name = 'RequestError'
    this.code = options.code
    this.data = options.data
    this.response = options.response
    this.status = options.status
  }
}
