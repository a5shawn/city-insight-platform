import type { Request, Response, NextFunction } from 'express'
import * as regionService from '../services/region.service'
import { sendSuccess, sendError, handleServiceError } from '../utils/response'
import { parsePositiveInt } from '../utils/params'

/** 省级区域列表 */
export const getProvinces = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await regionService.getProvinces()
    sendSuccess(res, data)
  } catch (err: any) {
    handleServiceError(err, res, next)
  }
}

/** 直接子区域列表（地图下钻） */
export const getChildren = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parsePositiveInt(req.params.id, 'id')
    if (!id.ok) {
      return sendError(res, 400, id.message)
    }
    const data = await regionService.getChildren(id.value)
    sendSuccess(res, data)
  } catch (err: any) {
    handleServiceError(err, res, next)
  }
}
