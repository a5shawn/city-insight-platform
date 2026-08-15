import type { Request, Response, NextFunction } from 'express'
import * as populationService from '../services/population.service'
import { sendSuccess, sendError, handleServiceError } from '../utils/response'
import { parsePositiveInt, parseOptionalPositiveInt } from '../utils/params'

/** 人口结构（城乡/性别/年龄单年快照） */
export const getStructure = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const region = parsePositiveInt(req.query.region_id, 'region_id')
    if (!region.ok) return sendError(res, 400, region.message)

    const year = parseOptionalPositiveInt(req.query.year, 'year', 1, 9999)
    if (!year.ok) return sendError(res, 400, year.message)

    const data = await populationService.getStructure(region.value, year.value)
    sendSuccess(res, data)
  } catch (err: any) {
    handleServiceError(err, res, next)
  }
}

/** 人口趋势（总量 + 净流入年度序列） */
export const getTrend = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const region = parsePositiveInt(req.query.region_id, 'region_id')
    if (!region.ok) return sendError(res, 400, region.message)

    const data = await populationService.getTrend(region.value)
    sendSuccess(res, data)
  } catch (err: any) {
    handleServiceError(err, res, next)
  }
}

/** 子区域人口排名（热力图叠加地图用） */
export const getRanking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const region = parsePositiveInt(req.query.region_id, 'region_id')
    if (!region.ok) return sendError(res, 400, region.message)

    const year = parseOptionalPositiveInt(req.query.year, 'year', 1, 9999)
    if (!year.ok) return sendError(res, 400, year.message)

    const limit = parseOptionalPositiveInt(req.query.limit, 'limit', 1, 200)
    if (!limit.ok) return sendError(res, 400, limit.message)

    const data = await populationService.getPopulationRanking(region.value, year.value, limit.value)
    sendSuccess(res, data)
  } catch (err: any) {
    handleServiceError(err, res, next)
  }
}
