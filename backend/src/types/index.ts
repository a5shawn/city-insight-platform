/** 统一 API 响应格式 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T | null
}

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

/** 用户信息（不含密码） */
export interface UserInfo {
  id: number
  username: string
  nickname: string
  createdAt: string
}

/** 区域 */
export interface Region {
  id: number
  name: string
  level: 1 | 2 | 3
  parentId: number | null
  areaCode: string | null
  longitude: number | null
  latitude: number | null
}

/** 经济数据 */
export interface EconomyData {
  id: number
  regionId: number
  year: number
  quarter: number | null
  gdp: number
  gdpGrowth: number
  primaryIndustry: number
  secondaryIndustry: number
  tertiaryIndustry: number
  budgetRevenue: number
  fixedInvestment: number
}

/** 人口数据 */
export interface PopulationData {
  id: number
  regionId: number
  year: number
  totalPopulation: number
  urbanPopulation: number
  ruralPopulation: number
  malePopulation: number
  femalePopulation: number
  age014: number
  age1559: number
  age60Plus: number
  netInflow: number
}

/** 交通数据 */
export interface TrafficData {
  id: number
  regionId: number
  recordDate: string
  hour: number | null
  congestionIndex: number
  busRidership: number
  metroRidership: number
  taxiRidership: number
  accidents: number
}

/** 环境数据 */
export interface EnvironmentData {
  id: number
  regionId: number
  recordDate: string
  aqi: number
  pm25: number
  pm10: number
  o3: number
  no2: number
  so2: number
  waterQuality: string
  greenCoverage: number
}
