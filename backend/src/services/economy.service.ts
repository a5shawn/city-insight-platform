import { query } from '../config/db'
import { verifyRegionExists } from './region.service'
import type { EconomyTrendPoint, IndustryStructure, InvestmentPoint, RankingItem } from '../types'

/** 查询该区域最新数据年份 */
const getLatestYear = async (regionId: number): Promise<number> => {
  const rows = await query<{ maxYear: number }[]>(
    'SELECT MAX(year) AS maxYear FROM economy_data WHERE region_id = ?',
    [regionId]
  )
  if (!rows[0]?.maxYear) {
    throw { status: 404, message: '该区域暂无经济数据' }
  }
  return rows[0].maxYear
}

/**
 * GDP 趋势序列（支持年/季度粒度切换）
 * 注意：种子数据仅省级生成季度数据，市级查询 quarter 返回空数组
 */
export const getGdpTrend = async (
  regionId: number,
  granularity: 'year' | 'quarter'
): Promise<EconomyTrendPoint[]> => {
  await verifyRegionExists(regionId)

  if (granularity === 'quarter') {
    return query<EconomyTrendPoint[]>(
      `SELECT year, quarter, gdp, gdp_growth AS gdpGrowth
       FROM economy_data
       WHERE region_id = ? AND quarter IS NOT NULL
       ORDER BY year, quarter`,
      [regionId]
    )
  }
  return query<EconomyTrendPoint[]>(
    `SELECT year, quarter, gdp, gdp_growth AS gdpGrowth
     FROM economy_data
     WHERE region_id = ? AND quarter IS NULL
     ORDER BY year`,
    [regionId]
  )
}

/** 产业结构（三产构成，year 缺省取最新年） */
export const getIndustry = async (regionId: number, year?: number): Promise<IndustryStructure> => {
  await verifyRegionExists(regionId)
  const targetYear = year ?? (await getLatestYear(regionId))
  const rows = await query<IndustryStructure[]>(
    `SELECT year, gdp, primary_industry AS primaryIndustry,
            secondary_industry AS secondaryIndustry, tertiary_industry AS tertiaryIndustry
     FROM economy_data
     WHERE region_id = ? AND quarter IS NULL AND year = ?`,
    [regionId, targetYear]
  )
  if (rows.length === 0) {
    throw { status: 404, message: `暂无 ${targetYear} 年经济数据` }
  }
  return rows[0]
}

/** 投资趋势（固定资产投资 + 财政收入年度序列） */
export const getInvestment = async (regionId: number): Promise<InvestmentPoint[]> => {
  await verifyRegionExists(regionId)
  return query<InvestmentPoint[]>(
    `SELECT year, fixed_investment AS fixedInvestment, budget_revenue AS budgetRevenue
     FROM economy_data
     WHERE region_id = ? AND quarter IS NULL
     ORDER BY year`,
    [regionId]
  )
}

/** 子区域 GDP 排名（year 缺省取最新年；排行榜与地图着色通用） */
export const getGdpRanking = async (
  regionId: number,
  year?: number,
  limit?: number
): Promise<RankingItem[]> => {
  await verifyRegionExists(regionId)
  const targetYear = year ?? (await getLatestYear(regionId))
  // limit 已在 controller 层校验为 1-200 的整数，可安全拼接
  const limitClause = limit !== undefined ? `LIMIT ${limit}` : ''
  return query<RankingItem[]>(
    `SELECT r.id AS regionId, r.name AS regionName, e.gdp AS \`value\`
     FROM regions r
     JOIN economy_data e ON e.region_id = r.id AND e.quarter IS NULL AND e.year = ?
     WHERE r.parent_id = ?
     ORDER BY \`value\` DESC
     ${limitClause}`,
    [targetYear, regionId]
  )
}
