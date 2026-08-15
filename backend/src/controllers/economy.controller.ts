import type { Request, Response, NextFunction } from 'express'
import * as economyService from '../services/economy.service'
import { sendSuccess, sendError, handleServiceError } from '../utils/response'
import { parsePositiveInt, parseOptionalPositiveInt, parseOptionalEnum } from '../utils/params'

/** GDP 趋势（支持年/季度粒度切换） */
export const getGdpTrend = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const region = parsePositiveInt(req.query.region_id, 'region_id')
    if (!region.ok) return sendError(res, 400, region.message)

    const granularity = parseOptionalEnum(
      req.query.granularity,
      'granularity',
      ['year', 'quarter'] as const,
      'year'
    )
    if (!granularity.ok) return sendError(res, 400, granularity.message)

    const data = await economyService.getGdpTrend(region.value, granularity.value)
    sendSuccess(res, data)
  } catch (err: any) {
    handleServiceError(err, res, next)
  }
}

/** 产业结构（三产构成） */
export const getIndustry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const region = parsePositiveInt(req.query.region_id, 'region_id')
    if (!region.ok) return sendError(res, 400, region.message)

    const year = parseOptionalPositiveInt(req.query.year, 'year', 1, 9999)
    if (!year.ok) return sendError(res, 400, year.message)

    const data = await economyService.getIndustry(region.value, year.value)
    sendSuccess(res, data)
  } catch (err: any) {
    handleServiceError(err, res, next)
  }
}

/** 投资趋势（固投 + 财政收入年度序列） */
export const getInvestment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const region = parsePositiveInt(req.query.region_id, 'region_id')
    if (!region.ok) return sendError(res, 400, region.message)

    const data = await economyService.getInvestment(region.value)
    sendSuccess(res, data)
  } catch (err: any) {
    handleServiceError(err, res, next)
  }
}

/** 子区域 GDP 排名 */
export const getRanking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const region = parsePositiveInt(req.query.region_id, 'region_id')
    if (!region.ok) return sendError(res, 400, region.message)

    const year = parseOptionalPositiveInt(req.query.year, 'year', 1, 9999)
    if (!year.ok) return sendError(res, 400, year.message)

    const limit = parseOptionalPositiveInt(req.query.limit, 'limit', 1, 200)
    if (!limit.ok) return sendError(res, 400, limit.message)

    const data = await economyService.getGdpRanking(region.value, year.value, limit.value)
    sendSuccess(res, data)
  } catch (err: any) {
    handleServiceError(err, res, next)
  }
}
