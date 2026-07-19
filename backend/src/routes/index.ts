import type { Express } from 'express'
import { authRouter } from './auth.routes'

/**
 * 集中注册所有路由模块
 * 后续每新增一个路由模块，在此注册
 */
export const registerRoutes = (app: Express) => {
  app.use('/api/auth', authRouter)

  // 后续步骤逐步注册：
  // app.use('/api/regions', regionRouter)
  // app.use('/api/dashboard', dashboardRouter)
  // app.use('/api/economy', economyRouter)
  // app.use('/api/population', populationRouter)
  // app.use('/api/traffic', trafficRouter)
  // app.use('/api/environment', environmentRouter)
}
