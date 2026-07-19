# 安徽城市数据洞察平台

城市级数据可视化分析平台，覆盖**经济、人口、交通、环境**四大领域，核心特色是**安徽省地图下钻（省→市→区县）**。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Vue 3 (Composition API) + Vite + ECharts + Pinia + Vue Router |
| 后端 | Express.js + JWT 鉴权 |
| 数据库 | MySQL |
| 编码规范 | 前后端统一 ESM 模块（`import/export`），后端 package.json 配置 `"type": "module"` |

## 项目结构

```
city-insight-platform/
├── frontend/                    # Vue3 前端（独立项目）
│   ├── public/maps/             # GeoJSON 地图数据
│   │   ├── anhui.json           # 安徽省地图
│   │   ├── hefei.json           # 合肥市区县地图
│   │   └── wuhu.json            # 芜湖市区县地图
│   ├── src/
│   │   ├── api/                 # API 请求封装（axios）
│   │   ├── assets/styles/       # 全局样式（深色科技风）
│   │   ├── components/
│   │   │   ├── Layout/          # 主布局 + 侧边栏
│   │   │   ├── Common/          # KpiCard, SkeletonLoader, RegionBreadcrumb
│   │   │   ├── Charts/          # 图表封装（BaseChart + 各类图表）
│   │   │   └── BigScreen/       # 大屏专用组件
│   │   ├── stores/              # Pinia（auth, map, theme）
│   │   ├── router/              # 路由配置
│   │   ├── views/               # 页面组件
│   │   └── utils/               # 工具函数 + ECharts 配置
│   └── package.json
│
├── backend/                     # Express 后端（独立项目）
│   ├── config/db.js             # MySQL 连接池
│   ├── middleware/auth.js       # JWT 验证中间件
│   ├── routes/                  # 路由模块（auth, regions, dashboard, economy, population, traffic, environment）
│   ├── scripts/                 # 模拟数据生成脚本（seedRegions.js, seedData.js）
│   ├── server.js                # 入口文件
│   └── package.json
│
└── sql/schema.sql               # 数据库建表脚本
```

## 页面路由

| 路由 | 页面 | 说明 |
|---|---|---|
| `/login` | 登录 | JWT 鉴权 |
| `/register` | 注册 | |
| `/` | 总览驾驶舱 | 安徽省地图 + KPI指标 + 告警 |
| `/economy` | 经济发展 | GDP趋势、产业结构、排名 |
| `/population` | 人口画像 | 年龄结构、城乡分布、流动 |
| `/traffic` | 交通监测 | 拥堵指数、公共交通、事故 |
| `/environment` | 生态环境 | AQI、污染物、水质、绿化 |
| `/bigscreen` | 全屏大屏 | 沉浸式指挥中心模式 |

## 核心功能

- **地图下钻**：安徽省 → 16市 → 区县（合肥+芜湖有区县地图）
- **图表联动**：地图点击区域 → 所有图表同步刷新该区域数据
- **芜湖高亮**：地图默认高亮芜湖市
- **面包屑导航**：支持"安徽省 > 芜湖市 > 镜湖区"层级返冑
- **全屏大屏**：自动轮播 + 模拟实时刷新 + 跑马灯

## API 设计

所有业务接口接受 `region_id` 参数，按区域筛选数据。

| 模块 | 路径前缀 |
|---|---|
| 认证 | `/api/auth/register`, `/api/auth/login` |
| 区域 | `/api/regions/provinces`, `/api/regions/:id/children` |
| 总览 | `/api/dashboard/*` |
| 经济 | `/api/economy/*` |
| 人口 | `/api/population/*` |
| 交通 | `/api/traffic/*` |
| 环境 | `/api/environment/*` |

## 快速启动

```bash
# 后端
cd backend
npm install
# 启动前确保 MySQL 已运行，创建数据库并执行 sql/schema.sql
node scripts/seedRegions.js    # 生成区域数据
node scripts/seedData.js       # 生成业务数据
node server.js                 # → http://localhost:3000

# 前端（新开终端）
cd frontend
npm install
npm run dev                    # → http://localhost:5173
```

## 数据库

6张表：`users`, `regions`（省市区三级）, `economy_data`, `population_data`, `traffic_data`, `environment_data`

所有数据为**模拟生成**（2021-2025年，覆盖省/市/区县三级），通过 `scripts/` 下的 seed 脚本批量入库。

## 视觉规范

深色科技风配色：

```css
--bg-primary:    #0a1628;
--bg-secondary:  #0f1d3a;
--accent:        #00d4ff;
--text-primary:  #ffffff;
--text-secondary: rgba(255,255,255,0.65);
--success:       #00e396;
--warning:       #f9d14a;
--danger:        #ff6b72;
--border:        rgba(0, 212, 255, 0.15);
```

## 开发约定

1. 前端使用 Composition API + `<script setup>` 语法
2. 后端使用 ESM（`import/export`），`package.json` 设置 `"type": "module"`
3. 图表组件统一继承 BaseChart（处理自适应 + 暗色主题）
4. 地图下钻状态通过 Pinia（`stores/map.js`）全局管理
5. 所有业务页面通过 `watch` 监听 `mapStore.currentRegion` 实现图表联动

---

## 分步学习路线（共15步）

本项目按**循序渐进**的方式分步实现，每一步聚焦一个知识点，建议按顺序走。

### 第1步：项目初始化 + 目录搭建
**知识点：** 工程化、项目结构设计、ESM 配置
- 创建 `frontend/` 和 `backend/` 目录
- 初始化 `package.json`（后端加 `"type": "module"`）
- 创建完整目录结构（参照上方项目结构）
- 配置 `.gitignore`

### 第2步：数据库设计 + 建表
**知识点：** 数据库设计、表关系、索引
- 编写 `sql/schema.sql`（6张表）
- MySQL 建库建表
- **面试点：** 为什么 regions 表用 parent_id 自关联？为什么加索引？

### 第3步：模拟数据生成脚本
**知识点：** Node.js 操作数据库、批量数据生成
- `seedRegions.js` — 生成省市区三级区域数据
- `seedData.js` — 生成近5年业务数据（经济/人口/交通/环境）
- **面试点：** 模拟数据怎么保证合理性和真实性？

### 第4步：后端 — 项目骨架 + JWT 认证
**知识点：** Express 框架、ESM 导入导出、JWT 鉴权
- Express 入口文件（跨域、中间件注册）
- MySQL 连接池配置
- 注册/登录接口（密码用 bcrypt 加密，JWT 签发）
- **面试点：** JWT 的工作流程？为什么用连接池？

### 第5步：后端 — 区域接口 + 业务接口
**知识点：** RESTful API 设计、查询优化
- 区域接口（省市区三级查询）
- 总览/经济/人口/交通/环境接口（支持 region_id 筛选）
- **面试点：** RESTful 风格规范？SQL 聚合查询怎么写？

### 第6步：前端 — 项目初始化
**知识点：** Vite 配置、Vue Router、Pinia、Axios
- Vite 创建 Vue3 项目
- 配置路由 + 路由鉴权守卫
- Pinia 状态管理（auth/map/theme）
- Axios 封装 + 请求拦截器（附 token）
- **面试点：** 路由守卫做了什么？Axios 拦截器的应用场景？

### 第7步：前端 — 登录/注册页面
**知识点：** 表单处理、前后端联调、Token 持久化
- Login.vue + Register.vue
- 调用后端接口完成鉴权
- 登录后跳转首页
- **面试点：** Token 存在哪？刷新页面怎么保持登录状态？

### 第8步：地图核心 — GeoJSON + MapChart 组件（核心难点）
**知识点：** ECharts 地图、GeoJSON、事件交互
- 获取安徽省 + 合肥/芜湖 GeoJSON 数据
- 封装 MapChart.vue 组件
- 实现地图着色（按GDP数值映射颜色）
- 实现芜湖市高亮
- 实现悬浮提示
- **面试点：** ECharts 地图原理？GeoJSON 是什么格式？

### 第9步：地图核心 — 下钻逻辑 + 面包屑导航
**知识点：** 状态管理、组件通信、交互设计
- 实现地图点击下钻（省→市→区县）
- Pinia 管理下钻状态（currentRegion + regionPath）
- 面包屑组件（支持点击返回上级）
- 图表联动机制（watch currentRegion）
- **面试点：** 下钻历史怎么管理？图表联动怎么实现？

### 第10步：前端 — 总览驾驶舱
**知识点：** 组件封装、布局设计
- KpiCard 组件（大号数字 + 同比箭头）
- 安徽地图 + 告警滚动条 + 排名列表
- 布局排版
- **面试点：** 数据加载和骨架屏怎么配合？

### 第11步：前端 — 经济发展页面
**知识点：** ECharts 各类图表、数据转换
- LineChart（GDP趋势，支持年/季度切换）
- RoseChart（产业结构）
- BarChart（各区县排名）
- AreaChart（投资趋势）

### 第12步：前端 — 人口画像 + 交通监测

**人口画像**
- 环形图（城乡分布）
- 折线图（人口流动）
- 热力图（人口分布叠加地图）

**交通监测**
- 堆叠面积图（公交/地铁/出租运量）
- 折线图（拥堵指数 + 高峰标记）
- 柱状图（事故统计）

### 第13步：前端 — 生态环境页面
**知识点：** 异形图表（仪表盘、雷达图）
- GaugeChart（AQI仪表盘）
- PieChart（污染物构成）
- BarChart（AQI排名）
- 横向条形图（绿化覆盖率）

### 第14步：全屏大屏
**知识点：** 自适应布局、定时器管理、动效
- ScreenFrame 全屏容器
- 地图自动轮播高亮
- 跑马灯滚动
- 实时时间 + 模拟数据刷新
- **面试点：** 定时器怎么管理避免内存泄漏？自适应方案？

### 第15步：联调 + 优化 + README
**知识点：** 项目收尾、文档写作
- 全流程联调
- ECharts 暗色主题统一
- 错误边界处理
- 写 README（含截图、启动方式、架构图）
- GitHub 推送

---

### 学习建议

- 每完成一步，**git commit 一次**，方便回退和回顾
- 遇到看不懂的代码先别复制，问我"为什么这么写"
- 面试考点标了⭐的要多理解原理，不只停留在会用
- 如果某一步卡住了，优先自己调试，实在不行叫我帮你排查
