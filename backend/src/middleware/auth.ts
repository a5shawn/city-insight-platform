import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { sendError } from '../utils/response.js'

const JWT_SECRET = process.env.JWT_SECRET || 'city-insight-secret-key'

export interface JwtPayload {
  userId: number
  username: string
}

/** JWT 验证中间件 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 401, '未提供认证令牌')
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    req.user = { userId: decoded.userId, username: decoded.username }
    next()
  } catch {
    return sendError(res, 401, '认证令牌无效或已过期')
  }
}

/** 生成 JWT */
export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}
