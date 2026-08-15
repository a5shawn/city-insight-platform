import type { Request, Response, NextFunction } from 'express'
import * as dashboardService from '../services/dashboard.service'
import { sendSuccess, sendError, handleServiceError } from '../utils/response'
import { parsePositiveInt, parseOptionalPositiveInt } from '../utils/params'

/** 总览 KPI 指标 */
export const getKpi = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const region = parsePositiveInt(req.query.region_id, 'region_id')
    if (!region.ok) return sendError(res, 400, region.message)

    const data = await dashboardService.getKpi(region.value)
    sendSuccess(res, data)
  } catch (err: any) {
    handleServiceError(err, res, next)
  }
}

/** 告警列表 */
export const getAlerts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const region = parsePositiveInt(req.query.region_id, 'region_id')
    if (!region.ok) return sendError(res, 400, region.message)

    const limit = parseOptionalPositiveInt(req.query.limit, 'limit', 1, 200)
    if (!limit.ok) return sendError(res, 400, limit.message)

    const data = await dashboardService.getAlerts(region.value, limit.value)
    sendSuccess(res, data)
  } catch (err: any) {
    handleServiceError(err, res, next)
  }
}
