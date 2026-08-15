import type { Request, Response, NextFunction } from 'express'
import * as trafficService from '../services/traffic.service'
import { sendSuccess, sendError, handleServiceError } from '../utils/response'
import { parsePositiveInt, parseOptionalPositiveInt } from '../utils/params'

/** 公共交通运量（公交/地铁/出租月度序列） */
export const getRidership = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const region = parsePositiveInt(req.query.region_id, 'region_id')
    if (!region.ok) return sendError(res, 400, region.message)

    const year = parseOptionalPositiveInt(req.query.year, 'year', 1, 9999)
    if (!year.ok) return sendError(res, 400, year.message)

    const data = await trafficService.getRidership(region.value, year.value)
    sendSuccess(res, data)
  } catch (err: any) {
    handleServiceError(err, res, next)
  }
}

/** 拥堵指数月度序列 + 高峰标记 */
export const getCongestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const region = parsePositiveInt(req.query.region_id, 'region_id')
    if (!region.ok) return sendError(res, 400, region.message)

    const data = await trafficService.getCongestion(region.value)
    sendSuccess(res, data)
  } catch (err: any) {
    handleServiceError(err, res, next)
  }
}

/** 年度事故汇总 */
export const getAccidents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const region = parsePositiveInt(req.query.region_id, 'region_id')
    if (!region.ok) return sendError(res, 400, region.message)

    const data = await trafficService.getAccidents(region.value)
    sendSuccess(res, data)
  } catch (err: any) {
    handleServiceError(err, res, next)
  }
}
