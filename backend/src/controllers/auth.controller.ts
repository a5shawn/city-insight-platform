import type { Request, Response, NextFunction } from 'express'
import * as authService from '../services/auth.service.js'
import { sendSuccess, sendError } from '../utils/response.js'

/** 注册 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, nickname } = req.body

    if (!username || !password) {
      return sendError(res, 400, '用户名和密码不能为空')
    }
    if (username.length < 3 || username.length > 20) {
      return sendError(res, 400, '用户名长度需在 3-20 个字符之间')
    }
    if (password.length < 6) {
      return sendError(res, 400, '密码长度不能少于 6 位')
    }

    const result = await authService.register(username, password, nickname)
    sendSuccess(res, result, '注册成功')
  } catch (err: any) {
    if (err.status && err.message) {
      return sendError(res, err.status, err.message)
    }
    next(err)
  }
}

/** 登录 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return sendError(res, 400, '用户名和密码不能为空')
    }

    const result = await authService.login(username, password)
    sendSuccess(res, result, '登录成功')
  } catch (err: any) {
    if (err.status && err.message) {
      return sendError(res, err.status, err.message)
    }
    next(err)
  }
}
