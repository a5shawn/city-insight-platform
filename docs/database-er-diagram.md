# 数据库表关联关系图

数据库：`city_insight`（MySQL，InnoDB，utf8mb4）

## ER 图

```mermaid
erDiagram
    users {
        int id PK "用户ID，自增"
        varchar username UK "登录用户名，唯一"
        varchar password "密码(bcrypt加密)"
        varchar nickname "显示昵称(可选)"
        datetime created_at "注册时间"
    }

    regions {
        int id PK "区域ID，自增"
        varchar name "区域名称"
        tinyint level "层级：1=省 2=市 3=区县"
        int parent_id FK "父级区域ID(NULL=顶级省)"
        varchar area_code "行政区划代码"
        decimal longitude "中心点经度"
        decimal latitude "中心点纬度"
    }

    economy_data {
        int id PK "记录ID"
        int region_id FK "关联区域ID"
        int year "年份(2021-2025)"
        tinyint quarter "季度(1-4，NULL=年度汇总)"
        decimal gdp "GDP(亿元)"
        decimal gdp_growth "GDP同比增速(%)"
        decimal primary_industry "第一产业增加值(亿元)"
        decimal secondary_industry "第二产业增加值(亿元)"
        decimal tertiary_industry "第三产业增加值(亿元)"
        decimal budget_revenue "一般公共预算收入(亿元)"
        decimal fixed_investment "固定资产投资(亿元)"
    }

    population_data {
        int id PK "记录ID"
        int region_id FK "关联区域ID"
        int year "年份(2021-2025)"
        int total_population "常住人口(万人)"
        int urban_population "城镇人口(万人)"
        int rural_population "农村人口(万人)"
        int male_population "男性人口(万人)"
        int female_population "女性人口(万人)"
        int age_0_14 "0-14岁人口(万人)"
        int age_15_59 "15-59岁人口(万人)"
        int age_60_plus "60岁以上人口(万人)"
        int net_inflow "净迁入人口(负数=净迁出)"
    }

    traffic_data {
        int id PK "记录ID"
        int region_id FK "关联区域ID"
        date record_date "记录日期"
        tinyint hour "小时(0-23，NULL=日汇总)"
        decimal congestion_index "拥堵指数(1.0畅通~2.0严重拥堵)"
        int bus_ridership "公交客运量(万人次)"
        int metro_ridership "地铁客运量(万人次)"
        int taxi_ridership "出租车客运量(万人次)"
        int accidents "交通事故数(起)"
    }

    environment_data {
        int id PK "记录ID"
        int region_id FK "关联区域ID"
        date record_date "记录日期"
        int aqi "空气质量指数(0-500)"
        decimal pm25 "PM2.5浓度(ug/m3)"
        decimal pm10 "PM10浓度(ug/m3)"
        decimal o3 "臭氧浓度(ug/m3)"
        decimal no2 "二氧化氮浓度(ug/m3)"
        decimal so2 "二氧化硫浓度(ug/m3)"
        varchar water_quality "水质等级(I~V类)"
        decimal green_coverage "绿化覆盖率(%)"
    }

    %% 区域自关联：parent_id 指向同表 id（省市区三级树）
    regions |o--o{ regions : "parent_id 自关联"

    %% 4 张业务表外键均指向 regions.id，级联删除
    regions ||--o{ economy_data : "region_id"
    regions ||--o{ population_data : "region_id"
    regions ||--o{ traffic_data : "region_id"
    regions ||--o{ environment_data : "region_id"
```

## 关系说明

| 关系 | 类型 | 说明 |
|---|---|---|
| `regions.parent_id → regions.id` | 自关联，1:N | 省市区三级树：省(parent_id=NULL) → 16市 → 104区县，共 121 条 |
| `economy_data.region_id → regions.id` | 1:N，`ON DELETE CASCADE` | 省/市/区县全部三级均有数据（省另有季度粒度） |
| `population_data.region_id → regions.id` | 1:N，`ON DELETE CASCADE` | 年度粒度，覆盖三级 |
| `traffic_data.region_id → regions.id` | 1:N，`ON DELETE CASCADE` | 月粒度（每月一条，hour 恒 NULL） |
| `environment_data.region_id → regions.id` | 1:N，`ON DELETE CASCADE` | 月粒度，覆盖三级 |
| `users` | 独立表 | 与业务数据无关联 |

## 设计要点（面试点）

1. **为什么 regions 用 `parent_id` 自关联而不是三张表？**
   - 层级结构统一：三级共用同一套字段（name/area_code/经纬度），增删层级（未来扩展乡镇）不需要加表
   - 查询简单：`WHERE parent_id = ?` 一条语句即可取任意层级的直接子级，配合 `level` 字段过滤层级
   - 地图下钻天然匹配：省→市→区县都是"找 children"这一个动作

2. **为什么加这些索引？**
   - `regions(parent_id)`、`regions(level)`：下钻查询最频繁的两个条件
   - 业务表 `(region_id, year)` / `(region_id, record_date)` 联合索引：所有业务接口都按"区域 + 时间"过滤，联合索引一次命中；单列 `(year)` / `(record_date)` 索引服务于跨区域的时间范围统计（如全平台某年汇总）

3. **为什么业务表统一外键指向 regions 并 `ON DELETE CASCADE`？**
   - 数据随区域级联清理，避免孤儿数据；配合 seed 脚本的 `TRUNCATE` 重灌流程不会留下脏数据

## 渲染方式

- GitHub / VS Code（安装 Markdown Preview Mermaid 插件）/ Typora 均可直接渲染本文件
- 需要 PNG 图片时可用 mermaid-cli：`npx @mermaid-js/mermaid-cli -i docs/database-er-diagram.md -o docs/database-er-diagram.png`
