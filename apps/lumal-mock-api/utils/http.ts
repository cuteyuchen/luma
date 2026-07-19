import type { H3Event } from 'h3'
import { setResponseStatus } from 'h3'

export interface AdminEnvelope<T> {
  result: T
  resultMsg: string
  statusCode: string
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status = 400,
    readonly code = 'VALIDATION_ERROR',
  ) {
    super(message)
  }
}

export function ok<T>(result: T): AdminEnvelope<T> {
  return { result, resultMsg: 'ok', statusCode: '0000' }
}

export function page<T>(records: T[], totalNum: number): AdminEnvelope<{ records: T[], totalNum: number }> {
  return ok({ records, totalNum })
}

export function fail(event: H3Event, error: unknown): AdminEnvelope<null> {
  const apiError = normalizeError(error)
  setResponseStatus(event, apiError.status)
  return { result: null, resultMsg: apiError.message, statusCode: apiError.code }
}

function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  const message = error instanceof Error ? error.message : '服务内部异常'

  if (/不存在|未找到/.test(message)) {
    return new ApiError(message, 404, 'NOT_FOUND')
  }
  if (/已存在|重复/.test(message)) {
    return new ApiError(message, 409, 'CONFLICT')
  }
  if (/不能删除|不能操作|无权限/.test(message)) {
    return new ApiError(message, 403, 'FORBIDDEN')
  }

  return new ApiError(message)
}
