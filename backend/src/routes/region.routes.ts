import { Router } from 'express'
import * as regionController from '../controllers/region.controller'

export const regionRouter = Router()

// GET /api/regions/provinces — 省级区域列表
regionRouter.get('/provinces', regionController.getProvinces)

// GET /api/regions/:id/children — 直接子区域列表（地图下钻）
regionRouter.get('/:id/children', regionController.getChildren)
