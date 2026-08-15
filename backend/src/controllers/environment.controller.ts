import type { Request, Response, NextFunction } from 'express'
import * as environmentService from '../services/environment.service'
import { sendSuccess, sendError, handleServiceError } from '../utils/response'
import { parsePositiveInt, parseOptionalPositiveInt, parseOptionalEnum } from '../utils/params'

/** AQI 详情（最新值 + 近 12 月序列） */
export const getAqi = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const region = parsePositiveInt(req.query.region_id, 'region_id')
    if (!region.ok) return sendError(res, 400, region.message)

    const data = await environmentService.getAqi(region.value)
    sendSuccess(res, data)
  } catch (err: any) {
    handleServiceError(err, res, next)
  }
}

/** 污染物构成（最新月） */
export const getPollutants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const region = parsePositiveInt(req.query.region_id, 'region_id')
    if (!region.ok) return sendError(res, 400, region.message)

    const data = await environmentService.getPollutants(region.value)
    sendSuccess(res, data)
  } catch (err: any) {
    handleServiceError(err, res, next)
  }
}

/** 绿化覆盖率（近 12 月序列） */
export const getGreen = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const region = parsePositiveInt(req.query.region_id, 'region_id')
    if (!region.ok) return sendError(res, 400, region.message)

    const data = await environmentService.getGreen(region.value)
    sendSuccess(res, data)
  } catch (err: any) {
    handleServiceError(err, res, next)
  }
}

/** 子区域环境排名（AQI 升序 / 绿化率降序） */
export const getRanking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const region = parsePositiveInt(req.query.region_id, 'region_id')
    if (!region.ok) return sendError(res, 400, region.message)

    const metric = parseOptionalEnum(
      req.query.metric,
      'metric',
      ['aqi', 'greenCoverage'] as const,
      'aqi'
    )
    if (!metric.ok) return sendError(res, 400, metric.message)

    const limit = parseOptionalPositiveInt(req.query.limit, 'limit', 1, 200)
    if (!limit.ok) return sendError(res, 400, limit.message)

    const data = await environmentService.getEnvironmentRanking(region.value, metric.value, limit.value)
    sendSuccess(res, data)
  } catch (err: any) {
    handleServiceError(err, res, next)
  }
}
