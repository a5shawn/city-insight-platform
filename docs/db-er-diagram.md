# city_insight 数据库表关系图（Mermaid 版）

> 与 `db-er-diagram.svg` 内容一致。本文件提交到 GitHub 后会自动渲染成图，也可在 Typora / VS Code（安装 Mermaid 插件）中预览。

```mermaid
erDiagram
    REGIONS ||--o{ REGIONS : "parent_id 自关联（省→市→区县）"
    REGIONS ||--o{ ECONOMY_DATA : "region_id"
    REGIONS ||--o{ POPULATION_DATA : "region_id"
    REGIONS ||--o{ TRAFFIC_DATA : "region_id"
    REGIONS ||--o{ ENVIRONMENT_DATA : "region_id"

    USERS {
        int id PK
        varchar username UK
        varchar password
        varchar nickname
        datetime created_at
    }

    REGIONS {
        int id PK
        varchar name
        tinyint level
        int parent_id FK
        varchar area_code
        decimal longitude
        decimal latitude
    }

    ECONOMY_DATA {
        int id PK
        int region_id FK
        int year
        tinyint quarter
        decimal gdp
        decimal gdp_growth
        decimal primary_industry
        decimal secondary_industry
        decimal tertiary_industry
        decimal budget_revenue
        decimal fixed_investment
    }

    POPULATION_DATA {
        int id PK
        int region_id FK
        int year
        int total_population
        int urban_population
        int rural_population
        int male_population
        int female_population
        int age_0_14
        int age_15_59
        int age_60_plus
        int net_inflow
    }

    TRAFFIC_DATA {
        int id PK
        int region_id FK
        date record_date
        tinyint hour
        decimal congestion_index
        int bus_ridership
        int metro_ridership
        int taxi_ridership
        int accidents
    }

    ENVIRONMENT_DATA {
        int id PK
        int region_id FK
        date record_date
        int aqi
        decimal pm25
        decimal pm10
        decimal o3
        decimal no2
        decimal so2
        varchar water_quality
        decimal green_coverage
    }
```

## 关系说明

| 关系 | 类型 | 说明 |
| --- | --- | --- |
| regions.parent_id → regions.id | 自关联 1:N | 省 → 市 → 区县 三级树形结构，`parent_id=NULL` 表示省级 |
| economy_data.region_id → regions.id | 多对一 | 经济数据按区域 + 年份（+ 季度）维度 |
| population_data.region_id → regions.id | 多对一 | 人口数据按区域 + 年份维度 |
| traffic_data.region_id → regions.id | 多对一 | 交通数据按区域 + 日期（+ 小时）维度 |
| environment_data.region_id → regions.id | 多对一 | 环境数据按区域 + 日期维度 |

所有业务表外键均为 `ON DELETE CASCADE`：删除区域时级联删除其下所有业务数据。
