import type { Express } from 'express'
import { authRouter } from './auth.routes'
import { regionRouter } from './region.routes'
import { dashboardRouter } from './dashboard.routes'
import { economyRouter } from './economy.routes'
import { populationRouter } from './population.routes'
import { trafficRouter } from './traffic.routes'
import { environmentRouter } from './environment.routes'
import { authMiddleware } from '../middleware/auth'

/**
 * 集中注册所有路由模块
 * 业务接口统一挂 authMiddleware：前端请求头需带 Authorization: Bearer <token>
 * 仅 /api/auth 与 /api/health 公开访问
 */
export const registerRoutes = (app: Express) => {
  app.use('/api/auth', authRouter)

  app.use('/api/regions', authMiddleware, regionRouter)
  app.use('/api/dashboard', authMiddleware, dashboardRouter)
  app.use('/api/economy', authMiddleware, economyRouter)
  app.use('/api/population', authMiddleware, populationRouter)
  app.use('/api/traffic', authMiddleware, trafficRouter)
  app.use('/api/environment', authMiddleware, environmentRouter)
}
