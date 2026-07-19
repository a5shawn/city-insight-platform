import bcrypt from 'bcryptjs'
import { generateToken } from '../middleware/auth'
import type { UserInfo } from '../types'

// 后续步骤：替换为真实数据库查询
interface MockUser {
  id: number
  username: string
  password: string
  nickname: string
}

const mockUsers: MockUser[] = []

/** 用户注册 */
export const register = async (
  username: string,
  password: string,
  nickname?: string
): Promise<UserInfo> => {
  const existing = mockUsers.find((u) => u.username === username)
  if (existing) {
    throw { status: 409, message: '用户名已存在' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser: MockUser = {
    id: mockUsers.length + 1,
    username,
    password: hashedPassword,
    nickname: nickname || username
  }
  mockUsers.push(newUser)

  return {
    id: newUser.id,
    username: newUser.username,
    nickname: newUser.nickname,
    createdAt: new Date().toISOString()
  }
}

/** 用户登录 */
export const login = async (
  username: string,
  password: string
): Promise<{ token: string; user: UserInfo }> => {
  const user = mockUsers.find((u) => u.username === username)
  if (!user) {
    throw { status: 401, message: '用户名或密码错误' }
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw { status: 401, message: '用户名或密码错误' }
  }

  const token = generateToken({ userId: user.id, username: user.username })
  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      createdAt: new Date().toISOString()
    }
  }
}
