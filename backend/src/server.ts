import express from 'express'
import type { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { registerRoutes } from './routes'
import { sendError } from './utils/response'

const app = express()
const PORT = 3000

// 全局中间件
app.use(cors())
app.use(express.json())

// 聚合注册所有路由
registerRoutes(app)

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: '服务运行中' })
})

// 404 处理（未匹配到任何路由）
app.use((req: Request, res: Response) => {
  sendError(res, 404, `接口不存在：${req.method} ${req.path}`)
})

// 全局错误处理（必须写满 4 个参数，Express 才会识别为错误中间件）
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('未捕获的服务端错误：', err)
  sendError(res, 500, '服务器内部错误')
})

app.listen(PORT, () => {
  console.log(`🚀 后端服务已启动：http://localhost:${PORT}`)
})
