import { Router } from 'express'
import * as populationController from '../controllers/population.controller'

export const populationRouter = Router()

// GET /api/population/structure — 人口结构（城乡/性别/年龄单年快照）
populationRouter.get('/structure', populationController.getStructure)

// GET /api/population/trend — 人口趋势（总量 + 净流入年度序列）
populationRouter.get('/trend', populationController.getTrend)

// GET /api/population/ranking — 子区域人口排名（热力图用）
populationRouter.get('/ranking', populationController.getRanking)
