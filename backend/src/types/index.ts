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

/** 指标值 + 同比（KPI 卡片用，yoy 为 null 表示无上年可比数据） */
export interface KpiValue {
  value: number
  yoy: number | null
}

/** 总览 KPI 集合 */
export interface DashboardKpi {
  gdp: KpiValue
  gdpGrowth: KpiValue
  population: KpiValue
  aqi: KpiValue
  congestionIndex: KpiValue
  budgetRevenue: KpiValue
}

/** 告警项 */
export interface AlertItem {
  id: string
  type: 'congestion' | 'aqi' | 'accidents' | 'gdp_growth'
  level: 'warning' | 'danger'
  title: string
  regionName: string
  value: number
  time: string
}

/** 排名项（排行榜 + 地图着色通用） */
export interface RankingItem {
  regionId: number
  regionName: string
  value: number
}

/** GDP 趋势点 */
export interface EconomyTrendPoint {
  year: number
  quarter: number | null
  gdp: number
  gdpGrowth: number
}

/** 产业结构（三产构成） */
export interface IndustryStructure {
  year: number
  gdp: number
  primaryIndustry: number
  secondaryIndustry: number
  tertiaryIndustry: number
}

/** 投资趋势点 */
export interface InvestmentPoint {
  year: number
  fixedInvestment: number
  budgetRevenue: number
}

/** 人口结构（单年快照） */
export interface PopulationStructure {
  year: number
  total: number
  urban: number
  rural: number
  male: number
  female: number
  age014: number
  age1559: number
  age60Plus: number
}

/** 人口趋势点 */
export interface PopulationTrendPoint {
  year: number
  totalPopulation: number
  netInflow: number
}

/** 公共交通运量点（月度） */
export interface RidershipPoint {
  date: string
  bus: number
  metro: number
  taxi: number
}

/** 拥堵指数点（月度，含高峰标记） */
export interface CongestionPoint {
  date: string
  congestionIndex: number
  isPeak: boolean
}

/** 年度事故汇总 */
export interface AccidentStat {
  year: number
  total: number
}

/** AQI 月度点 */
export interface AqiPoint {
  date: string
  aqi: number
  level: string
}

/** AQI 详情（仪表盘用：当前值 + 近 12 月序列） */
export interface AqiDetail {
  latest: AqiPoint | null
  series: AqiPoint[]
}

/** 污染物构成（最新月） */
export interface PollutantData {
  date: string
  pm25: number
  pm10: number
  o3: number
  no2: number
  so2: number
}

/** 绿化率月度点 */
export interface GreenPoint {
  date: string
  greenCoverage: number
}
