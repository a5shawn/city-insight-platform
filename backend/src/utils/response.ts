import type { Response, NextFunction } from 'express'
import type { ApiResponse } from '../types'

/** 成功响应 */
export function success<T>(data: T, message = '操作成功'): ApiResponse<T> {
  return {
    code: 200,
    message,
    data
  }
}

/** 创建成功响应（201） */
export function created<T>(data: T, message = '创建成功'): ApiResponse<T> {
  return {
    code: 201,
    message,
    data
  }
}

/** 错误响应 */
export function error(message: string, code = 400): ApiResponse<null> {
  return {
    code,
    message,
    data: null
  }
}

/** 服务器错误 */
export function serverError(message = '服务器内部错误'): ApiResponse<null> {
  return {
    code: 500,
    message,
    data: null
  }
}

/** 发送 JSON 成功响应 */
export function sendSuccess<T>(res: Response, data: T, message?: string) {
  res.json(success(data, message))
}

/** 发送 JSON 错误响应 */
export function sendError(res: Response, code: number, message: string) {
  res.status(code >= 100 && code < 600 ? code : 500).json(error(message, code))
}

/**
 * controller 统一错误处理
 * service 抛出的业务错误形如 throw { status, message }，这里转为标准错误响应；
 * 其余未知错误交给全局错误中间件处理
 */
export function handleServiceError(err: any, res: Response, next: NextFunction) {
  if (err.status && err.message) {
    return sendError(res, err.status, err.message)
  }
  next(err)
}
