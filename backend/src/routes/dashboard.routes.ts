import { Router } from 'express'
import * as dashboardController from '../controllers/dashboard.controller'

export const dashboardRouter = Router()

// GET /api/dashboard/kpi — 总览 KPI 指标
dashboardRouter.get('/kpi', dashboardController.getKpi)

// GET /api/dashboard/alerts — 告警列表
dashboardRouter.get('/alerts', dashboardController.getAlerts)
