import { query } from '../config/db'
import { verifyRegionExists } from './region.service'
import type { AqiDetail, AqiPoint, GreenPoint, PollutantData, RankingItem } from '../types'

/** 按国标（GB 3095）把 AQI 换算成空气质量等级 */
export const getAqiLevel = (aqi: number): string => {
  if (aqi <= 50) return '优'
  if (aqi <= 100) return '良'
  if (aqi <= 150) return '轻度污染'
  if (aqi <= 200) return '中度污染'
  if (aqi <= 300) return '重度污染'
  return '严重污染'
}

/** AQI 详情：最新值 + 近 12 月序列（仪表盘用） */
export const getAqi = async (regionId: number): Promise<AqiDetail> => {
  await verifyRegionExists(regionId)
  const rows = await query<{ date: string; aqi: number }[]>(
    `SELECT record_date AS date, aqi
     FROM environment_data
     WHERE region_id = ?
     ORDER BY record_date DESC
     LIMIT 12`,
    [regionId]
  )
  if (rows.length === 0) {
    throw { status: 404, message: '该区域暂无环境数据' }
  }
  // LIMIT 12 取的是倒序结果，反转回时间正序
  const series: AqiPoint[] = rows.reverse().map((r) => ({ ...r, level: getAqiLevel(r.aqi) }))
  return { latest: series[series.length - 1], series }
}

/** 污染物构成（最新月 5 项污染物，饼图用） */
export const getPollutants = async (regionId: number): Promise<PollutantData> => {
  await verifyRegionExists(regionId)
  const rows = await query<PollutantData[]>(
    `SELECT record_date AS date, pm25, pm10, o3, no2, so2
     FROM environment_data
     WHERE region_id = ?
     ORDER BY record_date DESC
     LIMIT 1`,
    [regionId]
  )
  if (rows.length === 0) {
    throw { status: 404, message: '该区域暂无环境数据' }
  }
  return rows[0]
}

/** 绿化覆盖率（近 12 月序列） */
export const getGreen = async (regionId: number): Promise<GreenPoint[]> => {
  await verifyRegionExists(regionId)
  const rows = await query<GreenPoint[]>(
    `SELECT record_date AS date, green_coverage AS greenCoverage
     FROM environment_data
     WHERE region_id = ?
     ORDER BY record_date DESC
     LIMIT 12`,
    [regionId]
  )
  return rows.reverse()
}

/**
 * 子区域环境排名
 * metric=aqi 升序（越低越好）/ greenCoverage 降序（越高越好）
 */
export const getEnvironmentRanking = async (
  regionId: number,
  metric: 'aqi' | 'greenCoverage',
  limit?: number
): Promise<RankingItem[]> => {
  await verifyRegionExists(regionId)
  // 列名走白名单映射，排序方向随指标语义变化
  const column = metric === 'aqi' ? 'aqi' : 'green_coverage'
  const direction = metric === 'aqi' ? 'ASC' : 'DESC'
  const limitClause = limit !== undefined ? `LIMIT ${limit}` : ''
  return query<RankingItem[]>(
    `SELECT r.id AS regionId, r.name AS regionName, env.${column} AS \`value\`
     FROM regions r
     JOIN environment_data env
       ON env.region_id = r.id
      AND env.record_date = (
            -- 相关子查询：取每个子区域各自的最新月份
            SELECT MAX(record_date) FROM environment_data e2 WHERE e2.region_id = r.id
          )
     WHERE r.parent_id = ?
     ORDER BY \`value\` ${direction}
     ${limitClause}`,
    [regionId]
  )
}
