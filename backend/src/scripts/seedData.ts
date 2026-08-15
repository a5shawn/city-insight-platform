/**
 * seedData.ts — 业务数据种子脚本
 *
 * 为省/市/区县三级区域生成 2021-2025 年模拟数据：
 * - economy_data：经济（GDP、产业、投资）
 * - population_data：人口（结构、城乡、流动）
 * - traffic_data：交通（拥堵、运量、事故）
 * - environment_data：环境（AQI、污染物、绿化）
 *
 * 运行：npx tsx src/scripts/seedData.ts
 */

import { query, batchInsert, truncate, closePool } from '../config/db'

// ============================================================
// 类型定义
// ============================================================
interface Region {
  id: number
  name: string
  level: number
  parentId: number | null
}

// ============================================================
// 基础数据：安徽省及各市 2021年 基准值
// 数值来源：安徽省统计年鉴趋势，做了一定调整以适配展示效果
// ============================================================
interface BaseEconomy {
  gdp: number // GDP（亿元）
  gdpGrowth: number // GDP增速（%）
  primaryPct: number // 一产占比（%）
  secondaryPct: number // 二产占比（%）
  budgetRevenue: number // 一般预算收入（亿元）
  fixedInvestment: number // 固定资产投资（亿元）
}

interface BasePopulation {
  total: number // 常住人口（万人）
  urbanPct: number // 城镇化率（%）
  malePct: number // 男性占比（%）
  age0_14Pct: number // 0-14岁占比（%）
  age15_59Pct: number // 15-59岁占比（%）
  netInflow: number // 净迁入（万人）
}

// 各市经济基准值（2021年）
const CITY_ECONOMY: Record<string, BaseEconomy> = {
  合肥市: {
    gdp: 11412,
    gdpGrowth: 9.2,
    primaryPct: 3.2,
    secondaryPct: 41.5,
    budgetRevenue: 844,
    fixedInvestment: 6500,
  },
  芜湖市: {
    gdp: 4303,
    gdpGrowth: 8.5,
    primaryPct: 4.0,
    secondaryPct: 48.0,
    budgetRevenue: 388,
    fixedInvestment: 2800,
  },
  滁州市: {
    gdp: 3362,
    gdpGrowth: 8.0,
    primaryPct: 9.5,
    secondaryPct: 48.5,
    budgetRevenue: 250,
    fixedInvestment: 2600,
  },
  阜阳市: {
    gdp: 3072,
    gdpGrowth: 7.5,
    primaryPct: 12.0,
    secondaryPct: 40.0,
    budgetRevenue: 185,
    fixedInvestment: 1900,
  },
  安庆市: {
    gdp: 2657,
    gdpGrowth: 7.0,
    primaryPct: 10.0,
    secondaryPct: 42.5,
    budgetRevenue: 160,
    fixedInvestment: 1700,
  },
  马鞍山市: {
    gdp: 2520,
    gdpGrowth: 7.8,
    primaryPct: 4.5,
    secondaryPct: 50.0,
    budgetRevenue: 210,
    fixedInvestment: 1600,
  },
  宿州市: {
    gdp: 2300,
    gdpGrowth: 7.2,
    primaryPct: 14.0,
    secondaryPct: 37.0,
    budgetRevenue: 140,
    fixedInvestment: 1500,
  },
  亳州市: {
    gdp: 2100,
    gdpGrowth: 7.0,
    primaryPct: 14.5,
    secondaryPct: 35.0,
    budgetRevenue: 130,
    fixedInvestment: 1400,
  },
  蚌埠市: {
    gdp: 1990,
    gdpGrowth: 6.5,
    primaryPct: 10.5,
    secondaryPct: 40.0,
    budgetRevenue: 168,
    fixedInvestment: 1500,
  },
  六安市: {
    gdp: 1920,
    gdpGrowth: 7.5,
    primaryPct: 13.0,
    secondaryPct: 38.5,
    budgetRevenue: 135,
    fixedInvestment: 1350,
  },
  淮南市: {
    gdp: 1500,
    gdpGrowth: 5.5,
    primaryPct: 8.0,
    secondaryPct: 44.0,
    budgetRevenue: 120,
    fixedInvestment: 1000,
  },
  宣城市: {
    gdp: 1800,
    gdpGrowth: 7.8,
    primaryPct: 8.5,
    secondaryPct: 46.0,
    budgetRevenue: 175,
    fixedInvestment: 1500,
  },
  铜陵市: {
    gdp: 1150,
    gdpGrowth: 6.0,
    primaryPct: 4.0,
    secondaryPct: 52.0,
    budgetRevenue: 110,
    fixedInvestment: 880,
  },
  池州市: {
    gdp: 1000,
    gdpGrowth: 7.0,
    primaryPct: 10.0,
    secondaryPct: 44.0,
    budgetRevenue: 75,
    fixedInvestment: 750,
  },
  淮北市: {
    gdp: 1200,
    gdpGrowth: 5.0,
    primaryPct: 7.0,
    secondaryPct: 47.0,
    budgetRevenue: 105,
    fixedInvestment: 850,
  },
  黄山市: {
    gdp: 950,
    gdpGrowth: 7.2,
    primaryPct: 7.5,
    secondaryPct: 37.0,
    budgetRevenue: 78,
    fixedInvestment: 650,
  },
}

// 各市人口基准值（2021年）
const CITY_POPULATION: Record<string, BasePopulation> = {
  合肥市: {
    total: 947,
    urbanPct: 82.3,
    malePct: 51.0,
    age0_14Pct: 16.5,
    age15_59Pct: 67.0,
    netInflow: 15.0,
  },
  芜湖市: {
    total: 367,
    urbanPct: 72.5,
    malePct: 50.4,
    age0_14Pct: 15.0,
    age15_59Pct: 65.5,
    netInflow: 3.5,
  },
  滁州市: {
    total: 399,
    urbanPct: 56.8,
    malePct: 51.2,
    age0_14Pct: 18.0,
    age15_59Pct: 62.0,
    netInflow: -1.0,
  },
  阜阳市: {
    total: 826,
    urbanPct: 43.5,
    malePct: 51.8,
    age0_14Pct: 22.5,
    age15_59Pct: 58.0,
    netInflow: -12.0,
  },
  安庆市: {
    total: 418,
    urbanPct: 52.3,
    malePct: 50.6,
    age0_14Pct: 17.5,
    age15_59Pct: 61.5,
    netInflow: -5.0,
  },
  马鞍山市: {
    total: 219,
    urbanPct: 71.8,
    malePct: 51.5,
    age0_14Pct: 14.5,
    age15_59Pct: 66.5,
    netInflow: 1.5,
  },
  宿州市: {
    total: 533,
    urbanPct: 44.2,
    malePct: 51.6,
    age0_14Pct: 20.0,
    age15_59Pct: 59.5,
    netInflow: -8.0,
  },
  亳州市: {
    total: 498,
    urbanPct: 42.0,
    malePct: 51.7,
    age0_14Pct: 21.0,
    age15_59Pct: 58.5,
    netInflow: -10.0,
  },
  蚌埠市: {
    total: 331,
    urbanPct: 58.5,
    malePct: 50.8,
    age0_14Pct: 17.0,
    age15_59Pct: 63.0,
    netInflow: -2.0,
  },
  六安市: {
    total: 440,
    urbanPct: 47.8,
    malePct: 51.4,
    age0_14Pct: 19.0,
    age15_59Pct: 60.5,
    netInflow: -7.0,
  },
  淮南市: {
    total: 303,
    urbanPct: 65.2,
    malePct: 51.3,
    age0_14Pct: 16.0,
    age15_59Pct: 64.0,
    netInflow: -3.0,
  },
  宣城市: {
    total: 250,
    urbanPct: 56.5,
    malePct: 51.1,
    age0_14Pct: 15.5,
    age15_59Pct: 63.5,
    netInflow: -0.5,
  },
  铜陵市: {
    total: 161,
    urbanPct: 68.0,
    malePct: 50.9,
    age0_14Pct: 15.5,
    age15_59Pct: 64.5,
    netInflow: -1.5,
  },
  池州市: {
    total: 134,
    urbanPct: 55.2,
    malePct: 51.2,
    age0_14Pct: 16.5,
    age15_59Pct: 62.0,
    netInflow: -0.8,
  },
  淮北市: {
    total: 187,
    urbanPct: 63.8,
    malePct: 51.6,
    age0_14Pct: 18.0,
    age15_59Pct: 62.5,
    netInflow: -2.5,
  },
  黄山市: {
    total: 133,
    urbanPct: 52.5,
    malePct: 50.5,
    age0_14Pct: 14.0,
    age15_59Pct: 64.0,
    netInflow: 0.3,
  },
}

// ============================================================
// 工具函数：生成带波动的合理数值
// ============================================================

/** 在一定范围内随机浮动 */
function fluctuate(base: number, pct: number): number {
  return base * (1 + (Math.random() - 0.5) * pct * 2)
}

/** 取整到指定位数 */
function roundTo(value: number, decimals: number): number {
  return Math.round(value * 10 ** decimals) / 10 ** decimals
}

/** 生成逐年增长率（GDP每年增长5-8%，逐渐放缓） */
function growthFactor(year: number): number {
  // 2021年增长较高，之后逐年放缓
  const factors: Record<number, number> = {
    2021: 1.0,
    2022: 1.055,
    2023: 1.052,
    2024: 1.048,
    2025: 1.045,
  }
  return factors[year] || 1.05
}

/** 生成季度GDP分配比例（Q1~Q4） */
function quarterRatio(quarter: number): number {
  const ratios = [0.22, 0.25, 0.26, 0.27] // 逐季递增
  return ratios[quarter - 1]
}

/** 生成城市某年的经济数据 */
function genEconomyForCity(year: number, base: BaseEconomy) {
  const factor = growthFactor(year)
  const yearlyGrowth = base.gdpGrowth * (1 - (year - 2021) * 0.05) // 增速逐年递减
  const gdp = roundTo(base.gdp * factor, 2)
  const gdpGrowth = roundTo(yearlyGrowth + (Math.random() - 0.5) * 1.0, 1)
  const totalIndustry = gdp
  const primary = roundTo(totalIndustry * (base.primaryPct / 100) * fluctuate(1, 0.05), 2)
  const secondary = roundTo(totalIndustry * (base.secondaryPct / 100) * fluctuate(1, 0.03), 2)
  const tertiary = roundTo(totalIndustry - primary - secondary, 2)
  const revenue = roundTo(base.budgetRevenue * factor * fluctuate(1, 0.05), 2)
  const investment = roundTo(base.fixedInvestment * factor * fluctuate(1, 0.08), 2)
  return { gdp, gdpGrowth, primary, secondary, tertiary, revenue, investment }
}

/** 生成区县某年的经济数据（按城市比例拆分） */
function genEconomyForDistrict(cityEconomy: ReturnType<typeof genEconomyForCity>, weight: number) {
  const w = weight * fluctuate(1, 0.1)
  return {
    gdp: roundTo(cityEconomy.gdp * w, 2),
    gdpGrowth: roundTo(cityEconomy.gdpGrowth + (Math.random() - 0.5) * 2, 1),
    primary: roundTo(cityEconomy.primary * w * fluctuate(1, 0.2), 2),
    secondary: roundTo(cityEconomy.secondary * w * fluctuate(1, 0.1), 2),
    tertiary: roundTo(cityEconomy.tertiary * w * fluctuate(1, 0.1), 2),
    revenue: roundTo(cityEconomy.revenue * w * fluctuate(1, 0.15), 2),
    investment: roundTo(cityEconomy.investment * w * fluctuate(1, 0.2), 2),
  }
}

/** 生成人口数据 */
function genPopulation(base: BasePopulation, year: number, isCity: boolean) {
  const y = year - 2021
  const totalGrowth = isCity ? 1 + y * 0.008 : 1 + y * 0.005 // 城市增长略快
  const urbanGrowth = 1 + y * 0.015 // 城镇化逐年提高
  const total = roundTo(base.total * totalGrowth * fluctuate(1, 0.01), 0)
  const urbanPct = Math.min(base.urbanPct * urbanGrowth, 90)
  const urban = roundTo((total * urbanPct) / 100, 0)
  const rural = total - urban
  const malePct = base.malePct + y * -0.05 // 男女比例逐年趋于平衡
  const male = roundTo((total * malePct) / 100, 0)
  const female = total - male
  const age0_14 = roundTo(total * (base.age0_14Pct / 100) * (1 - y * 0.01), 0)
  const age60Plus = roundTo(
    total * ((100 - base.age0_14Pct - base.age15_59Pct) / 100) * (1 + y * 0.03),
    0
  )
  const age15_59 = total - age0_14 - age60Plus
  const inflow = roundTo(base.netInflow * (1 + y * 0.02) + (Math.random() - 0.5) * 2, 1)
  return { total, urban, rural, male, female, age0_14, age15_59, age60Plus, inflow }
}

/** 生成交通数据（月粒度） */
function genTraffic(
  cityGdp: number, // GDP越高，交通流量越大
  isProvince: boolean,
  isCity: boolean,
  month: number,
  year: number
) {
  const scale = isProvince ? 1 : isCity ? 1 : 0.15
  const baseCongestion = cityGdp > 5000 ? 1.8 : cityGdp > 2000 ? 1.5 : 1.3
  // 早晚高峰、节假日因素
  const seasonFactor = [1.0, 0.95, 1.05, 1.1, 1.15, 1.1, 1.08, 1.05, 1.0, 1.02, 1.05, 1.1][
    month - 1
  ]
  const congestion = roundTo(
    baseCongestion * seasonFactor * (1 + (year - 2021) * 0.02) + (Math.random() - 0.5) * 0.3,
    2
  )
  const baseRidership = cityGdp * 0.5 * scale
  const bus = roundTo(baseRidership * seasonFactor * fluctuate(1, 0.1), 0)
  const metro = roundTo(baseRidership * 0.6 * seasonFactor * fluctuate(1, 0.08), 0)
  const taxi = roundTo(baseRidership * 0.3 * seasonFactor * fluctuate(1, 0.12), 0)
  const accidents = roundTo(
    Math.max(1, cityGdp * 0.02 * scale * seasonFactor * fluctuate(1, 0.2)),
    0
  )
  return { congestion, bus, metro, taxi, accidents }
}

/** 生成环境数据（月粒度） */
function genEnvironment(
  isProvince: boolean,
  isCity: boolean,
  isNorth: boolean, // 皖北城市冬季AQI更高
  month: number,
  year: number
) {
  const scale = isProvince ? 1 : isCity ? 1 : 0.95

  // AQI：冬高夏低，北方高南方低
  let baseAqi = isNorth ? 85 : 72
  const monthAqiFactor = [1.3, 1.25, 1.1, 0.95, 0.85, 0.75, 0.7, 0.72, 0.8, 0.95, 1.1, 1.2][
    month - 1
  ]
  const yearImprove = 1 - (year - 2021) * 0.015 // 逐年改善
  const aqi = roundTo(baseAqi * monthAqiFactor * yearImprove * scale * fluctuate(1, 0.08), 0)

  const pm25 = roundTo(aqi * 0.6 * fluctuate(1, 0.1), 1)
  const pm10 = roundTo(aqi * 0.85 * fluctuate(1, 0.1), 1)
  const o3 = roundTo((80 + Math.random() * 40) * (month >= 5 && month <= 9 ? 1.3 : 0.8), 1)
  const no2 = roundTo((30 + Math.random() * 20) * monthAqiFactor * 0.8, 1)
  const so2 = roundTo((10 + Math.random() * 10) * monthAqiFactor * 0.7, 1)

  const waterGrades = ['Ⅰ类', 'Ⅱ类', 'Ⅲ类', 'Ⅳ类']
  const waterIdx = isProvince ? 1 : isNorth ? 2 : 1
  const waterQuality = waterGrades[waterIdx + (Math.random() > 0.7 ? 1 : 0)]

  const baseGreen = isNorth ? 38 : 42
  const greenCoverage = roundTo(baseGreen + (year - 2021) * 0.5 + (Math.random() - 0.5) * 3, 1)

  return { aqi, pm25, pm10, o3, no2, so2, waterQuality, greenCoverage }
}

// ============================================================
// 主逻辑
// ============================================================
async function main() {
  // 1. 读取所有区域
  const regions = await query<Region[]>(
    'SELECT id, name, level, parent_id AS parentId FROM regions ORDER BY id'
  )
  console.log(`📌 读取到 ${regions.length} 个区域\n`)

  const province = regions.find((r) => r.level === 1)!
  const cities = regions.filter((r) => r.level === 2)
  const districtMap = new Map<number, Region[]>()
  for (const city of cities) {
    const districts = regions.filter((r) => r.level === 3 && r.parentId === city.id)
    districtMap.set(city.id, districts)
  }

  const years = [2021, 2022, 2023, 2024, 2025]
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const quarters = [1, 2, 3, 4]

  // 皖北城市列表（用于环境数据区分）
  const northCities = new Set(['阜阳市', '宿州市', '淮北市', '亳州市', '蚌埠市', '淮南市'])

  // ==========================================================
  // 2. 清空业务表
  // ==========================================================
  console.log('🗑️  清空业务表...')
  await truncate('economy_data')
  await truncate('population_data')
  await truncate('traffic_data')
  await truncate('environment_data')
  console.log('')

  // ==========================================================
  // 3.1 经济数据
  // ==========================================================
  console.log('📈 生成经济数据...')
  let ecoCount = 0

  // 省级：年度 + 季度
  const provEconomyByYear: Record<number, any> = {}

  for (const year of years) {
    // 省级 = 16市总和
    let totalGdp = 0,
      totalPrimary = 0,
      totalSecondary = 0,
      totalTertiary = 0
    let totalRevenue = 0,
      totalInvestment = 0
    let avgGrowth = 0

    for (const city of cities) {
      const base = CITY_ECONOMY[city.name]
      if (!base) continue
      const eco = genEconomyForCity(year, base)
      totalGdp += eco.gdp
      totalPrimary += eco.primary
      totalSecondary += eco.secondary
      totalTertiary += eco.tertiary
      totalRevenue += eco.revenue
      totalInvestment += eco.investment
      avgGrowth += eco.gdpGrowth
    }
    avgGrowth = roundTo(avgGrowth / cities.length, 1)

    provEconomyByYear[year] = {
      gdp: totalGdp,
      growth: avgGrowth,
      primary: totalPrimary,
      secondary: totalSecondary,
      tertiary: totalTertiary,
      revenue: totalRevenue,
      investment: totalInvestment,
    }

    // 年度
    await batchInsert(
      'economy_data',
      [
        'region_id',
        'year',
        'quarter',
        'gdp',
        'gdp_growth',
        'primary_industry',
        'secondary_industry',
        'tertiary_industry',
        'budget_revenue',
        'fixed_investment',
      ],
      [
        [
          province.id,
          year,
          null,
          roundTo(totalGdp, 2),
          avgGrowth,
          roundTo(totalPrimary, 2),
          roundTo(totalSecondary, 2),
          roundTo(totalTertiary, 2),
          roundTo(totalRevenue, 2),
          roundTo(totalInvestment, 2),
        ],
      ]
    )
    ecoCount++

    // 季度
    for (const q of quarters) {
      const qGdp = roundTo(totalGdp * quarterRatio(q), 2)
      await batchInsert(
        'economy_data',
        [
          'region_id',
          'year',
          'quarter',
          'gdp',
          'gdp_growth',
          'primary_industry',
          'secondary_industry',
          'tertiary_industry',
          'budget_revenue',
          'fixed_investment',
        ],
        [
          [
            province.id,
            year,
            q,
            qGdp,
            avgGrowth,
            roundTo(totalPrimary * quarterRatio(q), 2),
            roundTo(totalSecondary * quarterRatio(q), 2),
            roundTo(totalTertiary * quarterRatio(q), 2),
            roundTo(totalRevenue * quarterRatio(q), 2),
            roundTo(totalInvestment * quarterRatio(q), 2),
          ],
        ]
      )
      ecoCount++
    }
  }
  console.log(`   ✅ 安徽省 (${years.length * 5} 条)`)

  // 市级：年度（+季度仅省会城市）
  for (const city of cities) {
    const base = CITY_ECONOMY[city.name]
    if (!base) continue

    for (const year of years) {
      const eco = genEconomyForCity(year, base)
      await batchInsert(
        'economy_data',
        [
          'region_id',
          'year',
          'quarter',
          'gdp',
          'gdp_growth',
          'primary_industry',
          'secondary_industry',
          'tertiary_industry',
          'budget_revenue',
          'fixed_investment',
        ],
        [
          [
            city.id,
            year,
            null,
            eco.gdp,
            eco.gdpGrowth,
            eco.primary,
            eco.secondary,
            eco.tertiary,
            eco.revenue,
            eco.investment,
          ],
        ]
      )
      ecoCount++
    }

    // 区县级：年度（按城市GDP比例拆分）
    const districts = districtMap.get(city.id) || []
    if (districts.length === 0) continue

    // 每个区县分配权重
    const weights = districts.map(() => 0.5 + Math.random() * 1.0)
    const totalWeight = weights.reduce((a, b) => a + b, 0)
    const normalizedWeights = weights.map((w) => w / totalWeight)
    // 最后一个区县作为"其余"补齐，确保总和=1
    const adjustedWeights = [...normalizedWeights]
    const sumExceptLast = adjustedWeights.slice(0, -1).reduce((a, b) => a + b, 0)
    adjustedWeights[adjustedWeights.length - 1] = 1 - sumExceptLast

    for (const year of years) {
      const cityEco = genEconomyForCity(year, base)
      for (let i = 0; i < districts.length; i++) {
        const de = genEconomyForDistrict(cityEco, adjustedWeights[i])
        await batchInsert(
          'economy_data',
          [
            'region_id',
            'year',
            'quarter',
            'gdp',
            'gdp_growth',
            'primary_industry',
            'secondary_industry',
            'tertiary_industry',
            'budget_revenue',
            'fixed_investment',
          ],
          [
            [
              districts[i].id,
              year,
              null,
              de.gdp,
              de.gdpGrowth,
              de.primary,
              de.secondary,
              de.tertiary,
              de.revenue,
              de.investment,
            ],
          ]
        )
        ecoCount++
      }
    }
  }
  console.log(`   ✅ 16市 + 区县 (${ecoCount - 5} 条)`)
  console.log(`   📊 经济数据合计：${ecoCount} 条`)

  // ==========================================================
  // 3.2 人口数据
  // ==========================================================
  console.log('\n👥 生成人口数据...')
  let popCount = 0

  // 省级（=16市总和）
  for (const year of years) {
    let totalPop = 0,
      totalUrban = 0,
      totalRural = 0
    let totalMale = 0,
      totalFemale = 0
    let total0_14 = 0,
      total15_59 = 0,
      total60Plus = 0
    let totalInflow = 0

    for (const city of cities) {
      const base = CITY_POPULATION[city.name]
      if (!base) continue
      const p = genPopulation(base, year, true)
      totalPop += p.total
      totalUrban += p.urban
      totalRural += p.rural
      totalMale += p.male
      totalFemale += p.female
      total0_14 += p.age0_14
      total15_59 += p.age15_59
      total60Plus += p.age60Plus
      totalInflow += p.inflow
    }

    await batchInsert(
      'population_data',
      [
        'region_id',
        'year',
        'total_population',
        'urban_population',
        'rural_population',
        'male_population',
        'female_population',
        'age_0_14',
        'age_15_59',
        'age_60_plus',
        'net_inflow',
      ],
      [
        [
          province.id,
          year,
          totalPop,
          totalUrban,
          totalRural,
          totalMale,
          totalFemale,
          total0_14,
          total15_59,
          total60Plus,
          roundTo(totalInflow, 1),
        ],
      ]
    )
    popCount++
  }
  console.log(`   ✅ 安徽省 (${years.length} 条)`)

  // 市级 + 区县级
  for (const city of cities) {
    const base = CITY_POPULATION[city.name]
    if (!base) continue

    for (const year of years) {
      const p = genPopulation(base, year, true)
      await batchInsert(
        'population_data',
        [
          'region_id',
          'year',
          'total_population',
          'urban_population',
          'rural_population',
          'male_population',
          'female_population',
          'age_0_14',
          'age_15_59',
          'age_60_plus',
          'net_inflow',
        ],
        [
          [
            city.id,
            year,
            p.total,
            p.urban,
            p.rural,
            p.male,
            p.female,
            p.age0_14,
            p.age15_59,
            p.age60Plus,
            p.inflow,
          ],
        ]
      )
      popCount++
    }

    // 区县级：按街道数量比例拆人口
    const districts = districtMap.get(city.id) || []
    if (districts.length === 0) continue

    const basePop = base.total
    const dWeights = districts.map(() => 0.3 + Math.random() * 0.8)
    const dTotal = dWeights.reduce((a, b) => a + b, 0)
    const dNorm = dWeights.map((w) => w / dTotal)

    for (const year of years) {
      for (let i = 0; i < districts.length; i++) {
        const dw = dNorm[i]
        const dp: BasePopulation = {
          total: basePop * dw,
          urbanPct: base.urbanPct * (0.85 + Math.random() * 0.3),
          malePct: base.malePct,
          age0_14Pct: base.age0_14Pct,
          age15_59Pct: base.age15_59Pct,
          netInflow: base.netInflow * dw,
        }
        const p = genPopulation(dp, year, false)
        await batchInsert(
          'population_data',
          [
            'region_id',
            'year',
            'total_population',
            'urban_population',
            'rural_population',
            'male_population',
            'female_population',
            'age_0_14',
            'age_15_59',
            'age_60_plus',
            'net_inflow',
          ],
          [
            [
              districts[i].id,
              year,
              p.total,
              p.urban,
              p.rural,
              p.male,
              p.female,
              p.age0_14,
              p.age15_59,
              p.age60Plus,
              roundTo(p.inflow, 1),
            ],
          ]
        )
        popCount++
      }
    }
  }
  console.log(`   ✅ 全部区域 (${popCount} 条)`)

  // ==========================================================
  // 3.3 交通数据（月粒度）
  // ==========================================================
  console.log('\n🚗 生成交通数据...')
  let trafCount = 0
  const provGdp = 45000 // 安徽省GDP基准

  // 省级
  for (const year of years) {
    for (const month of months) {
      const t = genTraffic(provGdp, true, false, month, year)
      const date = `${year}-${String(month).padStart(2, '0')}-15`
      await batchInsert(
        'traffic_data',
        [
          'region_id',
          'record_date',
          'hour',
          'congestion_index',
          'bus_ridership',
          'metro_ridership',
          'taxi_ridership',
          'accidents',
        ],
        [[province.id, date, null, t.congestion, t.bus, t.metro, t.taxi, t.accidents]]
      )
      trafCount++
    }
  }
  console.log(`   ✅ 安徽省 (${years.length * months.length} 条)`)

  // 市级 + 区县级
  for (const city of cities) {
    const base = CITY_ECONOMY[city.name]
    if (!base) continue

    for (const year of years) {
      for (const month of months) {
        const t = genTraffic(base.gdp, false, true, month, year)
        const date = `${year}-${String(month).padStart(2, '0')}-15`
        await batchInsert(
          'traffic_data',
          [
            'region_id',
            'record_date',
            'hour',
            'congestion_index',
            'bus_ridership',
            'metro_ridership',
            'taxi_ridership',
            'accidents',
          ],
          [[city.id, date, null, t.congestion, t.bus, t.metro, t.taxi, t.accidents]]
        )
        trafCount++

        // 区县：只有市级的 10-20%
        const districts = districtMap.get(city.id) || []
        for (const d of districts) {
          const dt = genTraffic(base.gdp * 0.15, false, false, month, year)
          await batchInsert(
            'traffic_data',
            [
              'region_id',
              'record_date',
              'hour',
              'congestion_index',
              'bus_ridership',
              'metro_ridership',
              'taxi_ridership',
              'accidents',
            ],
            [[d.id, date, null, dt.congestion, dt.bus, dt.metro, dt.taxi, dt.accidents]]
          )
          trafCount++
        }
      }
    }
  }
  console.log(`   📊 交通数据合计：${trafCount} 条`)

  // ==========================================================
  // 3.4 环境数据（月粒度）
  // ==========================================================
  console.log('\n🌿 生成环境数据...')
  let envCount = 0

  // 省级
  for (const year of years) {
    for (const month of months) {
      const e = genEnvironment(true, false, false, month, year)
      const date = `${year}-${String(month).padStart(2, '0')}-15`
      await batchInsert(
        'environment_data',
        [
          'region_id',
          'record_date',
          'aqi',
          'pm25',
          'pm10',
          'o3',
          'no2',
          'so2',
          'water_quality',
          'green_coverage',
        ],
        [
          [
            province.id,
            date,
            e.aqi,
            e.pm25,
            e.pm10,
            e.o3,
            e.no2,
            e.so2,
            e.waterQuality,
            e.greenCoverage,
          ],
        ]
      )
      envCount++
    }
  }
  console.log(`   ✅ 安徽省 (${years.length * months.length} 条)`)

  // 市级 + 区县级
  for (const city of cities) {
    const isNorth = northCities.has(city.name)

    for (const year of years) {
      for (const month of months) {
        const e = genEnvironment(false, true, isNorth, month, year)
        const date = `${year}-${String(month).padStart(2, '0')}-15`
        await batchInsert(
          'environment_data',
          [
            'region_id',
            'record_date',
            'aqi',
            'pm25',
            'pm10',
            'o3',
            'no2',
            'so2',
            'water_quality',
            'green_coverage',
          ],
          [
            [
              city.id,
              date,
              e.aqi,
              e.pm25,
              e.pm10,
              e.o3,
              e.no2,
              e.so2,
              e.waterQuality,
              e.greenCoverage,
            ],
          ]
        )
        envCount++

        const districts = districtMap.get(city.id) || []
        for (const d of districts) {
          const de = genEnvironment(false, false, isNorth, month, year)
          await batchInsert(
            'environment_data',
            [
              'region_id',
              'record_date',
              'aqi',
              'pm25',
              'pm10',
              'o3',
              'no2',
              'so2',
              'water_quality',
              'green_coverage',
            ],
            [
              [
                d.id,
                date,
                de.aqi,
                de.pm25,
                de.pm10,
                de.o3,
                de.no2,
                de.so2,
                de.waterQuality,
                de.greenCoverage,
              ],
            ]
          )
          envCount++
        }
      }
    }
  }
  console.log(`   📊 环境数据合计：${envCount} 条`)

  // ==========================================================
  // 4. 统计汇总
  // ==========================================================
  const [ecoTotal] = await query<any>('SELECT COUNT(*) as count FROM economy_data')
  const [popTotal] = await query<any>('SELECT COUNT(*) as count FROM population_data')
  const [trafTotal] = await query<any>('SELECT COUNT(*) as count FROM traffic_data')
  const [envTotal] = await query<any>('SELECT COUNT(*) as count FROM environment_data')

  console.log('\n' + '='.repeat(50))
  console.log('📊 种子数据生成完成！')
  console.log('='.repeat(50))
  console.log(`   regions           ${regions.length} 条`)
  console.log(`   economy_data      ${ecoTotal.count} 条`)
  console.log(`   population_data   ${popTotal.count} 条`)
  console.log(`   traffic_data      ${trafTotal.count} 条`)
  console.log(`   environment_data  ${envTotal.count} 条`)
  console.log('='.repeat(50))

  await closePool()
}

main().catch((err) => {
  console.error('❌ 种子脚本失败：', err)
  process.exit(1)
})
