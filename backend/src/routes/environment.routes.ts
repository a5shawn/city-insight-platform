import { Router } from 'express'
import * as environmentController from '../controllers/environment.controller'

export const environmentRouter = Router()

// GET /api/environment/aqi — AQI 详情（最新值 + 近 12 月序列）
environmentRouter.get('/aqi', environmentController.getAqi)

// GET /api/environment/pollutants — 污染物构成（最新月）
environmentRouter.get('/pollutants', environmentController.getPollutants)

// GET /api/environment/green — 绿化覆盖率（近 12 月序列）
environmentRouter.get('/green', environmentController.getGreen)

// GET /api/environment/ranking — 子区域环境排名（AQI 升序 / 绿化率降序）
environmentRouter.get('/ranking', environmentController.getRanking)
