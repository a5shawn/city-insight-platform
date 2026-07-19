# 安徽城市数据洞察平台 PRD

> Product Requirements Document v2.0（最终版）
> 技术栈：Vue3 + ECharts + Express + MySQL
> 核心特色：安徽省地图下钻（省→市→区县）

---

## 1. 项目背景

面向政府数字化转型需求，构建以**安徽省**为核心的可视化分析平台，覆盖**经济、人口、交通、环境**四大领域。**地图下钻是核心体验**——从安徽省总览下钻到具体城市，再下钻到区县，每一层展示对应的数据指标。

项目定位为**求职作品集核心项目**，突出全栈能力 + ECharts 地图深度应用。

---

## 2. 功能清单（共48项）

### 2.1 基础功能（5项）

| #   | 功能     | 说明                   |
| --- | -------- | ---------------------- |
| 1   | 用户注册 | 用户名+密码注册        |
| 2   | 用户登录 | JWT 鉴权，前端存 token |
| 3   | 登出     | 清除 token，跳回登录页 |
| 4   | 路由鉴权 | 未登录自动跳转登录页   |

### 2.2 地图核心功能（9项）

| #   | 功能              | 说明                                       |
| --- | ----------------- | ------------------------------------------ |
| 5   | 安徽省地图展示    | 16个地级市完整地图渲染                     |
| 6   | 芜湖市高亮        | 地图上芜湖市特殊标记（边框/颜色）          |
| 7   | 地图着色          | 按 GDP 数值对各市着色（深→浅）             |
| 8   | 悬浮提示          | 鼠标悬浮显示市名 + GDP/人口                |
| 9   | 地图下钻：省→市   | 点击某市，地图切换到该市区县地图           |
| 10  | 地图下钻：市→区县 | 合肥+芜湖有地图，其余市显示数据列表        |
| 11  | 面包屑导航        | 显示"安徽省 > 芜湖市 > 镜湖区"，可点击返回 |
| 12  | 返回上级          | 点击面包屑或返回按钮回到上级               |
| 13  | 图表联动          | 地图切换区域时，页面上所有图表同步刷新     |

### 2.3 总览驾驶舱（4项）

| #   | 功能              | 说明                                         |
| --- | ----------------- | -------------------------------------------- |
| 14  | 关键指标卡（4个） | GDP、常住人口、总面积、平均AQI，各带同比箭头 |
| 15  | 安徽省地图        | 二级功能，支持下钻                           |
| 16  | 实时告警滚动条    | 滚动显示各市异常告警（模拟）                 |
| 17  | 各市GDP排名Top5   | 右侧列表展示                                 |

### 2.4 经济发展（5项）

| #   | 功能              | 说明                           |
| --- | ----------------- | ------------------------------ |
| 18  | GDP趋势图         | 近5年折线图，支持年/季度切换   |
| 19  | 产业结构玫瑰图    | 一产/二产/三产占比             |
| 20  | 各市GDP排名柱状图 | 横向柱状，全省排名             |
| 21  | 区县经济对比      | 选中市后，显示下辖区县经济对比 |
| 22  | 招商引资趋势      | 面积图，实际到位资金趋势       |

### 2.5 人口画像（4项）

| #   | 功能           | 说明                       |
| --- | -------------- | -------------------------- |
| 23  | 人口年龄结构   | 金字塔图（0-14/15-59/60+） |
| 24  | 城乡分布环形图 | 城镇 vs 农村人口           |
| 25  | 各区县人口分布 | 地图热力图叠加人口数据     |
| 26  | 人口流动趋势   | 折线图，迁入/迁出趋势      |

### 2.6 交通监测（4项）

| #   | 功能           | 说明                         |
| --- | -------------- | ---------------------------- |
| 27  | 实时路况概览   | 环形进度条 + 指标卡（模拟）  |
| 28  | 各时段拥堵指数 | 折线图，标记早/晚高峰        |
| 29  | 公共交通运量   | 堆叠面积图（公交/地铁/出租） |
| 30  | 交通事故统计   | 柱状图，按类型/区域          |

### 2.7 生态环境（4项）

| #   | 功能           | 说明                            |
| --- | -------------- | ------------------------------- |
| 31  | AQI仪表盘      | 仪表盘 + 趋势线 + 等级标注      |
| 32  | 主要污染物构成 | 环形图（PM2.5/PM10/O3/NO2/SO2） |
| 33  | 各市AQI排名    | 柱状图，最好到最差              |
| 34  | 各市绿化覆盖率 | 横向条形图                      |

### 2.8 全屏大屏（7项）

| #   | 功能             | 说明                           |
| --- | ---------------- | ------------------------------ |
| 35  | 全屏自适应       | 100vw×100vh 无侧边栏沉浸模式   |
| 36  | 大屏地图自动轮播 | 每5秒自动切换一个高亮城市      |
| 37  | 核心指标模块     | GDP/人口/城镇化率/AQI 大号展示 |
| 38  | GDP排名列表      | 右侧实时排名                   |
| 39  | 底部跑马灯       | 滚动显示各市关键指标           |
| 40  | 实时时间显示     | 右上角显示当前时间             |
| 41  | 数据自动刷新模拟 | 定时拉取数据，模拟实时效果     |

### 2.9 工程化（6项）

| #   | 功能                 | 说明                          |
| --- | -------------------- | ----------------------------- |
| 42  | 骨架屏加载           | 每个图表区域独立骨架屏        |
| 43  | 接口错误处理         | Toast 提示 + 占位显示         |
| 44  | 图表自适应           | 窗口缩放时图表自动 resize     |
| 45  | ECharts暗色主题      | 全站统一暗色科技风            |
| 46  | Vue3 Composition API | 全项目统一风格                |
| 47  | Pinia 状态管理       | 地图下钻状态、认证状态        |
| 48  | 模拟数据生成脚本     | 批量生成5年省/市/区县三级数据 |

---

## 3. 地图下钻设计（核心功能）

```
安徽省总览（全省16市数据）
    │
    ├── 点击合肥市 ──→ 合肥市详情（下辖9区县）
    │                    │
    │                    ├── 点击瑶海区 ──→ 瑶海区详情
    │                    ├── 点击蜀山区 ──→ 蜀山区详情
    │                    └── ...
    │
    ├── 点击芜湖市 ──→ 芜湖市详情（下辖7区县）
    │
    └── 其他14市...（切换到数据列表模式）
```

### 默认状态

- 打开页面默认显示 **安徽省地图**，16个市全部显示
- 芜湖市默认**高亮**
- 鼠标悬浮显示该市名称 + 简要数据（GDP/人口）
- 点击任意市 → 下钻到该市 → 显示该市区县数据

### 数据联动

当用户点击某个市或区县时，页面上**所有其他图表同步筛选**为当前区域的数据。

---

## 4. 业务场景

以**安徽省**为数据原型，模拟一个城市管理者的日常数据监控场景。

| 模块           | 业务场景                 | 负责人用它做什么                            |
| -------------- | ------------------------ | ------------------------------------------- |
| **总览驾驶舱** | 每天早上的"城市数据日报" | 一屏看全省GDP、人口、空气质量，发现异常区域 |
| **经济发展**   | 季度经济分析会           | 看各市GDP排名、产业结构变化、招商引资情况   |
| **人口画像**   | 人口发展规划             | 看各市人口结构、城镇化率、人口流动趋势      |
| **交通监测**   | 城市交通综合治理         | 看各市拥堵指数、公共交通运营、交通事故分布  |
| **环境生态**   | 环保督查                 | 看各市AQI排名、主要污染物、水质、绿化       |

---

## 5. 技术架构

```
┌─────────────────────────────────────────────┐
│              前端 (Vue3)                      │
│  Vue3 + Vite + Vue Router + Pinia + Axios   │
│  ECharts（地图/图表）+ 自定义深色主题         │
│  骨架屏 + 自适应布局                          │
└──────────────────┬──────────────────────────┘
                   │ HTTP API (RESTful)
┌──────────────────▼──────────────────────────┐
│           后端 (Express)                      │
│  Express + JWT + mysql2 + bcrypt + cors     │
│  路由模块：auth / regions / dashboard        │
│           / economy / population / traffic   │
│           / environment                       │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│               MySQL                           │
│  users / regions / economy_data              │
│  population_data / traffic_data              │
│  environment_data                            │
│  模拟数据：2021-2025年，省/市/区县三级        │
└─────────────────────────────────────────────┘
```

---

## 6. 数据库设计

### 6.1 用户表

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,   -- bcrypt 加密
  nickname VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 6.2 区域表（支撑地图下钻）

```sql
CREATE TABLE regions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  level TINYINT NOT NULL,           -- 1=省，2=市，3=区县
  parent_id INT,                    -- 父级ID
  area_code VARCHAR(20),
  longitude DECIMAL(10,6),
  latitude DECIMAL(10,6),
  FOREIGN KEY (parent_id) REFERENCES regions(id)
);

-- 数据预设：
-- 省：安徽省（level=1）
-- 市：合肥/芜湖/阜阳/安庆...（level=2, parent_id=安徽省）
-- 区县：瑶海区/镜湖区/颍州区...（level=3, parent_id=对应市）
```

### 6.3 经济数据表

```sql
CREATE TABLE economy_data (
  id INT PRIMARY KEY AUTO_INCREMENT,
  region_id INT NOT NULL,
  year INT NOT NULL,
  quarter INT,                         -- 季度（1-4，年度数据为NULL）
  gdp DECIMAL(15,2) DEFAULT 0,
  gdp_growth DECIMAL(5,2) DEFAULT 0,
  primary_industry DECIMAL(15,2) DEFAULT 0,
  secondary_industry DECIMAL(15,2) DEFAULT 0,
  tertiary_industry DECIMAL(15,2) DEFAULT 0,
  budget_revenue DECIMAL(15,2) DEFAULT 0,
  fixed_investment DECIMAL(15,2) DEFAULT 0,
  FOREIGN KEY (region_id) REFERENCES regions(id)
);
CREATE INDEX idx_economy_region_year ON economy_data(region_id, year);
```

### 6.4 人口数据表

```sql
CREATE TABLE population_data (
  id INT PRIMARY KEY AUTO_INCREMENT,
  region_id INT NOT NULL,
  year INT NOT NULL,
  total_population INT DEFAULT 0,
  urban_population INT DEFAULT 0,
  rural_population INT DEFAULT 0,
  male_population INT DEFAULT 0,
  female_population INT DEFAULT 0,
  age_0_14 INT DEFAULT 0,
  age_15_59 INT DEFAULT 0,
  age_60_plus INT DEFAULT 0,
  net_inflow INT DEFAULT 0,            -- 净迁入（可为负数）
  FOREIGN KEY (region_id) REFERENCES regions(id)
);
```

### 6.5 交通数据表

```sql
CREATE TABLE traffic_data (
  id INT PRIMARY KEY AUTO_INCREMENT,
  region_id INT NOT NULL,
  record_date DATE NOT NULL,
  hour INT DEFAULT 0,                  -- 小时(0-23)
  congestion_index DECIMAL(4,2) DEFAULT 0,
  bus_ridership INT DEFAULT 0,
  metro_ridership INT DEFAULT 0,
  taxi_ridership INT DEFAULT 0,
  accidents INT DEFAULT 0,
  FOREIGN KEY (region_id) REFERENCES regions(id)
);
```

### 6.6 环境数据表

```sql
CREATE TABLE environment_data (
  id INT PRIMARY KEY AUTO_INCREMENT,
  region_id INT NOT NULL,
  record_date DATE NOT NULL,
  aqi INT DEFAULT 0,
  pm25 DECIMAL(6,2) DEFAULT 0,
  pm10 DECIMAL(6,2) DEFAULT 0,
  o3 DECIMAL(6,2) DEFAULT 0,
  no2 DECIMAL(6,2) DEFAULT 0,
  so2 DECIMAL(6,2) DEFAULT 0,
  water_quality VARCHAR(20) DEFAULT '',
  green_coverage DECIMAL(5,2) DEFAULT 0,
  FOREIGN KEY (region_id) REFERENCES regions(id)
);
```

---

## 7. 页面与路由

| 路由           | 页面       | 说明               |
| -------------- | ---------- | ------------------ |
| `/login`       | 登录       |                    |
| `/register`    | 注册       |                    |
| `/`            | 总览驾驶舱 | 默认含安徽省地图   |
| `/economy`     | 经济发展   | 联动当前选中区域   |
| `/population`  | 人口画像   | 联动当前选中区域   |
| `/traffic`     | 交通监测   | 联动当前选中区域   |
| `/environment` | 生态环境   | 联动当前选中区域   |
| `/bigscreen`   | 全屏大屏   | 独立路由，无侧边栏 |

### 地图导航交互

```
总览页地图点击 "芜湖市"
  → 页面标题变为 "安徽省 > 芜湖市"
  → 地图切换为芜湖市区县地图
  → 所有KPI指标切换为芜湖市数据
  → 底部图表同步刷新

点击 "安徽省" 面包屑
  → 返回省级视图

点击芜湖市区县地图的 "镜湖区"
  → 页面标题变为 "安徽省 > 芜湖市 > 镜湖区"
  → 数据切换到镜湖区级别
```

---

## 8. API 设计

### 8.1 区域相关

| 方法 | 路径                        | 说明                 |
| ---- | --------------------------- | -------------------- |
| GET  | `/api/regions/provinces`    | 获取所有省           |
| GET  | `/api/regions/:id/children` | 获取某区域的下级区域 |
| GET  | `/api/regions/:id`          | 获取区域详情         |

### 8.2 认证

| 方法 | 路径                 | 说明          |
| ---- | -------------------- | ------------- |
| POST | `/api/auth/register` | 注册          |
| POST | `/api/auth/login`    | 登录，返回JWT |

### 8.3 业务数据（均接受 `?region_id=` 参数）

| 方法 | 路径                              | 说明         |
| ---- | --------------------------------- | ------------ |
| GET  | `/api/dashboard/summary`          | 关键指标汇总 |
| GET  | `/api/dashboard/map-data`         | 地图着色数据 |
| GET  | `/api/economy/gdp-trend`          | GDP趋势      |
| GET  | `/api/economy/industry-structure` | 产业结构     |
| GET  | `/api/economy/district-ranking`   | 下级区域排名 |
| GET  | `/api/economy/investment`         | 投资趋势     |
| GET  | `/api/population/structure`       | 人口结构     |
| GET  | `/api/population/flow`            | 人口流动     |
| GET  | `/api/traffic/congestion`         | 拥堵指数     |
| GET  | `/api/traffic/public-transit`     | 公共交通     |
| GET  | `/api/environment/aqi`            | 空气质量     |
| GET  | `/api/environment/pollutants`     | 污染物       |

---

## 9. 视觉设计规范

### 配色

```css
--bg-primary: #0a1628; /* 主背景 */
--bg-secondary: #0f1d3a; /* 卡片背景 */
--bg-card: rgba(15, 29, 58, 0.8);
--accent: #00d4ff; /* 主强调色 */
--accent-dim: rgba(0, 212, 255, 0.2);
--text-primary: #ffffff;
--text-secondary: rgba(255, 255, 255, 0.65);
--text-dim: rgba(255, 255, 255, 0.45);
--success: #00e396;
--warning: #f9d14a;
--danger: #ff6b72;
--border: rgba(0, 212, 255, 0.15);
```

### 设计语言

- **深色背景 + 发光边框** — 所有卡片使用 `border: 1px solid var(--border)` + `box-shadow`
- **字体** — 数字用等宽字体（`monospace`），展示数据感
- **KPI卡片** — 大号数字 + 同比箭头（↑绿色/↓红色）+ 小字说明
- **图表** — 所有图表统一暗色主题，tooltip深色半透明背景

---

## 10. GeoJSON 地图数据方案

| 地图         | 来源           | 用途                         |
| ------------ | -------------- | ---------------------------- |
| `anhui.json` | DataV.GeoAtlas | 安徽省16市边界，省→市下钻    |
| `hefei.json` | DataV.GeoAtlas | 合肥市9区县边界，市→区县下钻 |
| `wuhu.json`  | DataV.GeoAtlas | 芜湖市7区县边界，市→区县下钻 |

其余14个市点击后切换到**数据列表模式**展示区县数据（不加载地图）。

---

## 11. 开发计划（2-3周）

### 第一阶段：基础设施（3天）

| 天    | 任务                                        |
| ----- | ------------------------------------------- |
| Day 1 | 数据库建表 + 生成区域数据脚本（省市区三级） |
| Day 2 | 生成业务数据脚本（5年，省/市/区县三级）     |
| Day 3 | 后端项目 + 所有路由 + JWT + API联调         |

### 第二阶段：地图核心 + 前端框架（4天）

| 天    | 任务                                          |
| ----- | --------------------------------------------- |
| Day 4 | 获取 GeoJSON，注册 ECharts 地图               |
| Day 5 | 实现 MapChart 组件 + 下钻 + 面包屑            |
| Day 6 | 前端框架（路由/Layout/Pinia/Axios）+ 登录注册 |
| Day 7 | 总览驾驶舱（KPI卡 + 地图 + 告警 + 趋势）      |

### 第三阶段：业务页面（4天）

| 天     | 任务         |
| ------ | ------------ |
| Day 8  | 经济发展页面 |
| Day 9  | 人口画像页面 |
| Day 10 | 交通监测页面 |
| Day 11 | 生态环境页面 |

### 第四阶段：大屏 + 收尾（3天）

| 天     | 任务                                     |
| ------ | ---------------------------------------- |
| Day 12 | 全屏大屏页面（布局 + 地图轮播 + 指标卡） |
| Day 13 | 大屏动效 + 自适应 + 联调                 |
| Day 14 | 整体联调 + README + 截图 + 优化          |

---

## 12. 求职价值

### 简历描述

```
城市数据洞察平台 | Vue3 + ECharts + Express + MySQL
- 实现安徽省→市→区县三级地图下钻，点击地图联动所有图表
- 30+种ECharts图表可视化，涵盖GDP/人口/交通/环境四大领域
- 全屏指挥中心大屏，支持自动轮播+实时数据模拟
- 独立完成从数据库设计→后端API→前端可视化全链路开发
```

### 面试亮点

| 项目亮点                          | 面试官关注点                        |
| --------------------------------- | ----------------------------------- |
| 地图下钻（省→市→区县）            | ECharts 深度使用、GeoJSON、事件交互 |
| 图表联动（地图点击→所有图表刷新） | 状态管理设计、组件通信              |
| 全屏指挥中心大屏                  | 自适应、动效、定时器管理            |
| 30+种图表覆盖                     | 可视化场景理解、图表选型认知        |
| 5年完整模拟数据                   | 数据结构设计、数据生成能力          |
| 前后端全栈                        | 独立项目落地能力                    |

---

## 13. 项目目录结构

```
city-insight-platform/
├── backend/
│   ├── config/
│   │   └── db.js                 # MySQL连接池
│   ├── middleware/
│   │   └── auth.js               # JWT验证
│   ├── routes/
│   │   ├── auth.js               # 登录/注册
│   │   ├── regions.js            # 区域查询
│   │   ├── dashboard.js          # 总览数据
│   │   ├── economy.js            # 经济数据
│   │   ├── population.js         # 人口数据
│   │   ├── traffic.js            # 交通数据
│   │   └── environment.js        # 环境数据
│   ├── scripts/
│   │   ├── seedRegions.js        # 区域数据生成
│   │   └── seedData.js           # 业务数据生成
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── maps/                 # GeoJSON地图数据
│   │       ├── anhui.json
│   │       ├── hefei.json
│   │       └── wuhu.json
│   ├── src/
│   │   ├── api/                  # API请求封装
│   │   ├── assets/styles/        # 全局样式
│   │   ├── components/
│   │   │   ├── Layout/           # 布局组件
│   │   │   ├── Common/           # 通用组件
│   │   │   ├── Charts/           # 图表封装
│   │   │   └── BigScreen/        # 大屏专用组件
│   │   ├── stores/               # Pinia状态管理
│   │   ├── router/
│   │   ├── views/                # 页面
│   │   ├── utils/
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── sql/
│   └── schema.sql                # 建表脚本
├── README.md
└── package.json
```

---

> 文档版本：v2.0（最终版）
> 最后更新：2026-07-19
