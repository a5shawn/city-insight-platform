import express from 'express'
import cors from 'cors'
import { registerRoutes } from './routes/index.js'

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

app.listen(PORT, () => {
  console.log(`🚀 后端服务已启动：http://localhost:${PORT}`)
})
