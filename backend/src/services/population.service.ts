import { query } from '../config/db'
import { verifyRegionExists } from './region.service'
import type { PopulationStructure, PopulationTrendPoint, RankingItem } from '../types'

/** 查询该区域最新人口数据年份 */
const getLatestYear = async (regionId: number): Promise<number> => {
  const rows = await query<{ maxYear: number }[]>(
    'SELECT MAX(year) AS maxYear FROM population_data WHERE region_id = ?',
    [regionId]
  )
  if (!rows[0]?.maxYear) {
    throw { status: 404, message: '该区域暂无人口数据' }
  }
  return rows[0].maxYear
}

/** 人口结构（城乡/性别/年龄单年快照，year 缺省取最新年） */
export const getStructure = async (regionId: number, year?: number): Promise<PopulationStructure> => {
  await verifyRegionExists(regionId)
  const targetYear = year ?? (await getLatestYear(regionId))
  const rows = await query<PopulationStructure[]>(
    `SELECT year, total_population AS total, urban_population AS urban, rural_population AS rural,
            male_population AS male, female_population AS female,
            age_0_14 AS age014, age_15_59 AS age1559, age_60_plus AS age60Plus
     FROM population_data
     WHERE region_id = ? AND year = ?`,
    [regionId, targetYear]
  )
  if (rows.length === 0) {
    throw { status: 404, message: `暂无 ${targetYear} 年人口数据` }
  }
  return rows[0]
}

/** 人口趋势（常住人口总量 + 净流入年度序列） */
export const getTrend = async (regionId: number): Promise<PopulationTrendPoint[]> => {
  await verifyRegionExists(regionId)
  return query<PopulationTrendPoint[]>(
    `SELECT year, total_population AS totalPopulation, net_inflow AS netInflow
     FROM population_data
     WHERE region_id = ?
     ORDER BY year`,
    [regionId]
  )
}

/** 子区域人口排名（热力图叠加地图用，year 缺省取最新年） */
export const getPopulationRanking = async (
  regionId: number,
  year?: number,
  limit?: number
): Promise<RankingItem[]> => {
  await verifyRegionExists(regionId)
  const targetYear = year ?? (await getLatestYear(regionId))
  const limitClause = limit !== undefined ? `LIMIT ${limit}` : ''
  return query<RankingItem[]>(
    `SELECT r.id AS regionId, r.name AS regionName, p.total_population AS \`value\`
     FROM regions r
     JOIN population_data p ON p.region_id = r.id AND p.year = ?
     WHERE r.parent_id = ?
     ORDER BY \`value\` DESC
     ${limitClause}`,
    [targetYear, regionId]
  )
}
