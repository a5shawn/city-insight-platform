/** 登录请求 */
export interface LoginRequest {
  username: string
  password: string
}

/** 注册请求 */
export interface RegisterRequest {
  username: string
  password: string
  nickname?: string
}

/** 登录响应 */
export interface LoginResponse {
  token: string
  user: UserInfo
}

/** 用户信息 */
export interface UserInfo {
  id: number
  username: string
  nickname: string
}
