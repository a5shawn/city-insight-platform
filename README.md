# 🏙️ 安徽城市数据洞察平台

> 城市级数据可视化分析平台 — 学习项目 / 前端全栈求职作品

基于 **Vue3 + ECharts + Express + MySQL** 构建，以**安徽省**为数据原型，实现地图下钻（省→市→区县）的数据可视化分析系统，覆盖**经济、人口、交通、环境**四大领域。

---

## ✨ 功能特色

- **🗺️ 安徽省地图下钻** — 省→16市→区县三级下钻，芜湖市默认高亮，点击地图联动所有图表
- **📊 30+ 种 ECharts 图表** — 折线图、柱状图、地图、热力图、玫瑰图、仪表盘、雷达图等
- **📈 四大分析模块** — 经济发展、人口画像、交通监测、生态环境
- **🖥️ 全屏指挥中心** — 沉浸式大屏展示，自动轮播 + 模拟实时刷新 + 跑马灯
- **🔐 JWT 鉴权** — 用户注册登录，接口安全保护

## 🧰 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Vue 3 (Composition API) + Vite + ECharts 5 + Pinia + Vue Router |
| 后端 | Express.js + JWT + bcrypt |
| 数据库 | MySQL 8 |
| 模块规范 | **ESM**（前后端统一 `import/export`） |

## 🏗️ 项目结构

```
city-insight-platform/
├── frontend/                    # Vue3 前端
│   ├── public/maps/             # GeoJSON 地图数据
│   ├── src/
│   │   ├── api/                 # Axios 接口封装
│   │   ├── components/          # 组件（Layout / Common / Charts / BigScreen）
│   │   ├── stores/              # Pinia 状态管理
│   │   ├── router/              # 路由
│   │   ├── views/               # 页面
│   │   └── utils/               # 工具函数
│   └── vite.config.js
│
├── backend/                     # Express 后端
│   ├── config/db.js             # MySQL 连接池
│   ├── middleware/auth.js       # JWT 鉴权
│   ├── routes/                  # 路由（auth / regions / dashboard / economy / ...）
│   ├── scripts/                 # 模拟数据生成脚本
│   └── server.js
│
├── sql/schema.sql               # 数据库建表脚本
└── README.md
```

## 🚀 快速启动

### 前置要求

- Node.js >= 18
- MySQL 8.0+
- npm

### 1. 克隆项目

```bash
git clone https://github.com/a5shawn/city-insight-platform.git
cd city-insight-platform
```

### 2. 数据库初始化

```bash
# 登录 MySQL 创建数据库
mysql -u root -p
CREATE DATABASE city_insight CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE city_insight;
SOURCE sql/schema.sql;
exit
```

### 3. 启动后端

```bash
cd backend
npm install
cp .env.example .env   # 配置数据库连接信息
node scripts/seedRegions.js     # 生成区域数据（省市区三级）
node scripts/seedData.js        # 生成业务数据（近5年）
npm run dev                     # http://localhost:3000
```

### 4. 启动前端

```bash
cd frontend
npm install
npm run dev                     # http://localhost:5173
```

> 前端开发服务器已配置代理，`/api/*` 请求自动转发到后端 `3000` 端口。

## 📖 学习路线

本项目按**15步循序渐进**的方式实现，每步聚焦一个知识点：

| 步骤 | 内容 | 知识点 |
|---|---|---|
| 01 | 项目初始化 + 目录搭建 | 工程化、ESM 配置 |
| 02 | 数据库设计 + 建表 | 表关系、索引 |
| 03 | 模拟数据生成脚本 | Node.js 操作数据库 |
| 04 | 后端 JWT 认证 | Express、JWT、bcrypt |
| 05 | 后端业务接口 | RESTful API、SQL 聚合 |
| 06 | 前端项目初始化 | Vite、Router、Pinia、Axios |
| 07 | 登录/注册页面 | 表单处理、Token 持久化 |
| 08 | 地图 + GeoJSON | ECharts 地图渲染 |
| 09 | 地图下钻 + 联动 | 状态管理、组件通信 |
| 10 | 总览驾驶舱 | 组件封装、布局 |
| 11 | 经济发展页面 | ECharts 各类图表 |
| 12 | 人口 + 交通页面 | 热力图、堆叠图 |
| 13 | 生态环境页面 | 仪表盘、雷达图 |
| 14 | 全屏大屏 | 自适应、定时器、动效 |
| 15 | 联调 + 优化 + README | 项目收尾 |

## 🎯 项目目标

本项目的初衷是为**前端开发者提供一个可放入简历的全栈可视化作品**，展示以下能力：

- ✅ Vue3 全家桶 + ECharts 深度使用
- ✅ Express + MySQL 全栈开发
- ✅ 独立项目从 0 到 1 的落地能力
- ✅ 工程化思维（目录设计、组件化、状态管理）

## 📄 License

MIT © [a5shawn](https://github.com/a5shawn)
