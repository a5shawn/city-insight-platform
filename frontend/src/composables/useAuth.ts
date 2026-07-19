import { ref, computed } from 'vue'
import type { LoginRequest, RegisterRequest, UserInfo } from '@/types'

/** 认证相关组合式函数 */
export function useAuth() {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<UserInfo | null>(null)

  const isLoggedIn = computed(() => !!token.value)

  const login = async (credentials: LoginRequest) => {
    // 后续步骤对接真实 API
    const mockToken = 'mock-jwt-token'
    const mockUser: UserInfo = { id: 1, username: credentials.username, nickname: credentials.username }
    token.value = mockToken
    user.value = mockUser
    localStorage.setItem('token', mockToken)
    return mockUser
  }

  const register = async (data: RegisterRequest) => {
    // 后续步骤对接真实 API
    const mockUser: UserInfo = { id: 1, username: data.username, nickname: data.nickname || data.username }
    return mockUser
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  const restoreSession = () => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      token.value = savedToken
      // 后续步骤：调接口获取用户信息
    }
  }

  return {
    token,
    user,
    isLoggedIn,
    login,
    register,
    logout,
    restoreSession
  }
}
