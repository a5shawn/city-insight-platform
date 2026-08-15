import { query } from '../config/db'
import { verifyRegionExists } from './region.service'
import type { AlertItem, DashboardKpi, KpiValue } from '../types'

/** 计算同比（%）；上年无数据或为 0 时返回 null */
const calcYoy = (current: number, previous: number | null | undefined): number | null => {
  if (previous === null || previous === undefined || previous === 0) return null
  return Number((((current - previous) / previous) * 100).toFixed(2))
}

/**
 * 总览 KPI：6 项核心指标（值 + 同比）
 * 年度数据（经济/人口）取近两年对比；月度数据（交通/环境）取最新月与去年同月对比
 */
export const getKpi = async (regionId: number): Promise<DashboardKpi> => {
  await verifyRegionExists(regionId)

  const [economy, population, latestTraffic, latestEnvironment] = await Promise.all([
    query<{ year: number; gdp: number; gdp_growth: number; budget_revenue: number }[]>(
      `SELECT year, gdp, gdp_growth, budget_revenue
       FROM economy_data
       WHERE region_id = ? AND quarter IS NULL
       ORDER BY year DESC
       LIMIT 2`,
      [regionId]
    ),
    query<{ year: number; total_population: number }[]>(
      `SELECT year, total_population
       FROM population_data
       WHERE region_id = ?
       ORDER BY year DESC
       LIMIT 2`,
      [regionId]
    ),
    query<{ date: string; congestion_index: number }[]>(
      `SELECT record_date AS date, congestion_index
       FROM traffic_data
       WHERE region_id = ? AND hour IS NULL
       ORDER BY record_date DESC
       LIMIT 1`,
      [regionId]
    ),
    query<{ date: string; aqi: number }[]>(
      `SELECT record_date AS date, aqi
       FROM environment_data
       WHERE region_id = ?
       ORDER BY record_date DESC
       LIMIT 1`,
      [regionId]
    )
  ])

  const [curEco, prevEco] = economy
  const [curPop, prevPop] = population
  if (!curEco || !curPop || !latestTraffic[0] || !latestEnvironment[0]) {
    throw { status: 404, message: '该区域业务数据不完整，请先执行 seed 脚本' }
  }

  // 去年同月数据（DATE_SUB 把最新月往前推 1 年）
  const [prevCongestion, prevAqi] = await Promise.all([
    query<{ congestion_index: number }[]>(
      `SELECT congestion_index
       FROM traffic_data
       WHERE region_id = ? AND hour IS NULL AND record_date = DATE_SUB(?, INTERVAL 1 YEAR)`,
      [regionId, latestTraffic[0].date]
    ),
    query<{ aqi: number }[]>(
      `SELECT aqi
       FROM environment_data
       WHERE region_id = ? AND record_date = DATE_SUB(?, INTERVAL 1 YEAR)`,
      [regionId, latestEnvironment[0].date]
    )
  ])

  const kpi = (value: number, previous?: number): KpiValue => ({
    value,
    yoy: calcYoy(value, previous)
  })

  return {
    gdp: kpi(curEco.gdp, prevEco?.gdp),
    gdpGrowth: { value: curEco.gdp_growth, yoy: null }, // 增速本身就是同比口径，不再嵌套同比
    population: kpi(curPop.total_population, prevPop?.total_population),
    aqi: kpi(latestEnvironment[0].aqi, prevAqi[0]?.aqi),
    congestionIndex: kpi(latestTraffic[0].congestion_index, prevCongestion[0]?.congestion_index),
    budgetRevenue: kpi(curEco.budget_revenue, prevEco?.budget_revenue)
  }
}

/**
 * 告警列表：从业务数据实时派生（不单独建表）
 * 拥堵指数 > 1.8 / AQI > 100 / 事故数 TOP3 / GDP 增速垫底，danger 优先排序
 */
export const getAlerts = async (regionId: number, limit = 10): Promise<AlertItem[]> => {
  await verifyRegionExists(regionId)

  const [congestion, aqi, accidents, gdpGrowth] = await Promise.all([
    query<{ regionId: number; regionName: string; value: number; date: string }[]>(
      `SELECT r.id AS regionId, r.name AS regionName, t.congestion_index AS \`value\`, t.record_date AS date
       FROM regions r
       JOIN traffic_data t
         ON t.region_id = r.id AND t.hour IS NULL
        AND t.record_date = (SELECT MAX(record_date) FROM traffic_data t2 WHERE t2.region_id = r.id AND t2.hour IS NULL)
       WHERE r.parent_id = ? AND t.congestion_index > 1.8
       ORDER BY t.congestion_index DESC`,
      [regionId]
    ),
    query<{ regionId: number; regionName: string; value: number; date: string }[]>(
      `SELECT r.id AS regionId, r.name AS regionName, env.aqi AS \`value\`, env.record_date AS date
       FROM regions r
       JOIN environment_data env
         ON env.region_id = r.id
        AND env.record_date = (SELECT MAX(record_date) FROM environment_data e2 WHERE e2.region_id = r.id)
       WHERE r.parent_id = ? AND env.aqi > 100
       ORDER BY env.aqi DESC`,
      [regionId]
    ),
    query<{ regionId: number; regionName: string; value: number; date: string }[]>(
      `SELECT r.id AS regionId, r.name AS regionName, t.accidents AS \`value\`, t.record_date AS date
       FROM regions r
       JOIN traffic_data t
         ON t.region_id = r.id AND t.hour IS NULL
        AND t.record_date = (SELECT MAX(record_date) FROM traffic_data t2 WHERE t2.region_id = r.id AND t2.hour IS NULL)
       WHERE r.parent_id = ?
       ORDER BY t.accidents DESC
       LIMIT 3`,
      [regionId]
    ),
    query<{ regionId: number; regionName: string; value: number; year: number }[]>(
      `SELECT r.id AS regionId, r.name AS regionName, e.gdp_growth AS \`value\`, e.year
       FROM regions r
       JOIN economy_data e
         ON e.region_id = r.id AND e.quarter IS NULL
        AND e.year = (SELECT MAX(year) FROM economy_data e2 WHERE e2.region_id = r.id AND e2.quarter IS NULL)
       WHERE r.parent_id = ?
       ORDER BY e.gdp_growth ASC
       LIMIT 3`,
      [regionId]
    )
  ])

  const alerts: AlertItem[] = [
    ...congestion.map((r): AlertItem => ({
      id: `congestion-${r.regionId}`,
      type: 'congestion',
      level: r.value >= 2 ? 'danger' : 'warning',
      title: '交通拥堵指数偏高',
      regionName: r.regionName,
      value: r.value,
      time: r.date.slice(0, 7)
    })),
    ...aqi.map((r): AlertItem => ({
      id: `aqi-${r.regionId}`,
      type: 'aqi',
      level: r.value > 150 ? 'danger' : 'warning',
      title: '空气质量污染',
      regionName: r.regionName,
      value: r.value,
      time: r.date.slice(0, 7)
    })),
    ...accidents.map((r): AlertItem => ({
      id: `accidents-${r.regionId}`,
      type: 'accidents',
      level: 'warning',
      title: '交通事故多发',
      regionName: r.regionName,
      value: r.value,
      time: r.date.slice(0, 7)
    })),
    ...gdpGrowth.map((r): AlertItem => ({
      id: `gdp_growth-${r.regionId}`,
      type: 'gdp_growth',
      level: r.value < 0 ? 'danger' : 'warning',
      title: 'GDP 增速垫底',
      regionName: r.regionName,
      value: r.value,
      time: String(r.year)
    }))
  ]

  // danger 优先，同等级按数值降序
  alerts.sort((a, b) => {
    if (a.level !== b.level) return a.level === 'danger' ? -1 : 1
    return b.value - a.value
  })

  return alerts.slice(0, limit)
}
