import type { EChartsOption } from 'echarts'

/** 图表组件 Props */
export interface ChartProps {
  options: EChartsOption
  width?: string | number
  height?: string | number
  theme?: 'dark' | 'light'
  loading?: boolean
}

/** KPI 指标卡 Props */
export interface KpiCardProps {
  title: string
  value: string | number
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  trendValue?: string
  loading?: boolean
}

/** 图表类型枚举 */
export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
  ROSE = 'rose',
  RADAR = 'radar',
  GAUGE = 'gauge',
  MAP = 'map',
  AREA = 'area',
  HEATMAP = 'heatmap'
}
