import { Router } from 'express'
import * as economyController from '../controllers/economy.controller'

export const economyRouter = Router()

// GET /api/economy/gdp-trend — GDP 趋势（年/季度切换）
economyRouter.get('/gdp-trend', economyController.getGdpTrend)

// GET /api/economy/industry — 产业结构（三产构成）
economyRouter.get('/industry', economyController.getIndustry)

// GET /api/economy/investment — 投资趋势（固投 + 财政收入）
economyRouter.get('/investment', economyController.getInvestment)

// GET /api/economy/ranking — 子区域 GDP 排名
economyRouter.get('/ranking', economyController.getRanking)
