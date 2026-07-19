import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3000

// 中间件
app.use(cors())
app.use(express.json())

// 占位路由
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务运行中' })
})

// 后续步骤：注册业务路由模块
// import authRoutes from './routes/auth.js'
// app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
  console.log(`🚀 后端服务已启动：http://localhost:${PORT}`)
})
