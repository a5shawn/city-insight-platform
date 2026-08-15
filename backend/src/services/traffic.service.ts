import { query } from '../config/db'
import { verifyRegionExists } from './region.service'
import type { AccidentStat, CongestionPoint, RidershipPoint } from '../types'

/** 公共交通运量（公交/地铁/出租月度序列，year 缺省返回全部月份） */
export const getRidership = async (regionId: number, year?: number): Promise<RidershipPoint[]> => {
  await verifyRegionExists(regionId)

  if (year !== undefined) {
    // 范围查询比 YEAR(record_date) 更友好，能命中 (region_id, record_date) 联合索引
    return query<RidershipPoint[]>(
      `SELECT record_date AS date, bus_ridership AS bus, metro_ridership AS metro, taxi_ridership AS taxi
       FROM traffic_data
       WHERE region_id = ? AND hour IS NULL AND record_date BETWEEN ? AND ?
       ORDER BY record_date`,
      [regionId, `${year}-01-01`, `${year}-12-31`]
    )
  }
  return query<RidershipPoint[]>(
    `SELECT record_date AS date, bus_ridership AS bus, metro_ridership AS metro, taxi_ridership AS taxi
     FROM traffic_data
     WHERE region_id = ? AND hour IS NULL
     ORDER BY record_date`,
    [regionId]
  )
}

/** 拥堵指数月度序列 + 高峰标记（取该区域最高的 3 个月标记为高峰） */
export const getCongestion = async (regionId: number): Promise<CongestionPoint[]> => {
  await verifyRegionExists(regionId)
  const rows = await query<{ date: string; congestionIndex: number }[]>(
    `SELECT record_date AS date, congestion_index AS congestionIndex
     FROM traffic_data
     WHERE region_id = ? AND hour IS NULL
     ORDER BY record_date`,
    [regionId]
  )
  // SQL 负责取数，简单的业务判断（高峰月份）在 JS 里完成
  const peakDates = [...rows]
    .sort((a, b) => b.congestionIndex - a.congestionIndex)
    .slice(0, 3)
    .map((r) => r.date)
  return rows.map((r) => ({ ...r, isPeak: peakDates.includes(r.date) }))
}

/** 年度事故汇总（GROUP BY + SUM 聚合，本步核心面试点） */
export const getAccidents = async (regionId: number): Promise<AccidentStat[]> => {
  await verifyRegionExists(regionId)
  return query<AccidentStat[]>(
    `SELECT YEAR(record_date) AS year, SUM(accidents) AS total
     FROM traffic_data
     WHERE region_id = ? AND hour IS NULL
     GROUP BY YEAR(record_date)
     ORDER BY year`,
    [regionId]
  )
}
