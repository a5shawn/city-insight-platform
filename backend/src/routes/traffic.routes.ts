import { Router } from 'express'
import * as trafficController from '../controllers/traffic.controller'

export const trafficRouter = Router()

// GET /api/traffic/ridership — 公共交通运量（公交/地铁/出租月度序列）
trafficRouter.get('/ridership', trafficController.getRidership)

// GET /api/traffic/congestion — 拥堵指数月度序列 + 高峰标记
trafficRouter.get('/congestion', trafficController.getCongestion)

// GET /api/traffic/accidents — 年度事故汇总
trafficRouter.get('/accidents', trafficController.getAccidents)
