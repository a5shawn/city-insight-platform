-- ============================================================
-- 安徽城市数据洞察平台 - 数据库建表脚本
-- 数据库：city_insight
-- 字符集：utf8mb4（支持完整中文）
-- 引擎：InnoDB（支持事务 + 外键）
-- ============================================================

CREATE DATABASE IF NOT EXISTS city_insight
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE city_insight;

-- ============================================================
-- 1. 用户表 -- 登录认证
-- ============================================================
CREATE TABLE users (
  id         INT          PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
  username   VARCHAR(50)  NOT NULL UNIQUE            COMMENT '登录用户名',
  password   VARCHAR(255) NOT NULL                    COMMENT '密码(bcrypt加密)',
  nickname   VARCHAR(50)                              COMMENT '显示昵称(可选)',
  created_at DATETIME     DEFAULT CURRENT_TIMESTAMP   COMMENT '注册时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表-登录认证';

-- ============================================================
-- 2. 区域表 -- 核心枢纽，支撑地图省市区三级下钻
--    自关联：parent_id 指向本表 id，形成树形结构
--    level: 1=省, 2=市, 3=区县
-- ============================================================
CREATE TABLE regions (
  id         INT          PRIMARY KEY AUTO_INCREMENT COMMENT '区域ID',
  name       VARCHAR(50)  NOT NULL                    COMMENT '区域名称(如安徽省合肥市镜湖区)',
  level      TINYINT      NOT NULL                    COMMENT '层级:1=省2=市3=区县',
  parent_id  INT                                      COMMENT '父级区域ID(NULL=顶级省)',
  area_code  VARCHAR(20)                              COMMENT '行政区划代码(如340100=合肥市)',
  longitude  DECIMAL(10,6)                            COMMENT '中心点经度(地图标注用)',
  latitude   DECIMAL(10,6)                            COMMENT '中心点纬度(地图标注用)',
  FOREIGN KEY (parent_id) REFERENCES regions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='区域表-省市区三级树形结构支撑地图下钻';

CREATE INDEX idx_regions_level ON regions(level);
CREATE INDEX idx_regions_parent_id ON regions(parent_id);

-- ============================================================
-- 3. 经济数据表 -- GDP、产业结构、投资
--    年度+季度双粒度(quarter=NULL表示年度汇总)
-- ============================================================
CREATE TABLE economy_data (
  id                 INT            PRIMARY KEY AUTO_INCREMENT COMMENT '记录ID',
  region_id          INT            NOT NULL                    COMMENT '关联区域ID->regions.id',
  year               INT            NOT NULL                    COMMENT '年份(2021-2025)',
  quarter            TINYINT                                   COMMENT '季度(1-4,NULL=年度汇总)',
  gdp                DECIMAL(15,2)  DEFAULT 0                   COMMENT 'GDP(亿元)',
  gdp_growth         DECIMAL(5,2)   DEFAULT 0                   COMMENT 'GDP同比增速(%)',
  primary_industry   DECIMAL(15,2)  DEFAULT 0                   COMMENT '第一产业增加值(亿元)',
  secondary_industry DECIMAL(15,2)  DEFAULT 0                   COMMENT '第二产业增加值(亿元)',
  tertiary_industry  DECIMAL(15,2)  DEFAULT 0                   COMMENT '第三产业增加值(亿元)',
  budget_revenue     DECIMAL(15,2)  DEFAULT 0                   COMMENT '一般公共预算收入(亿元)',
  fixed_investment   DECIMAL(15,2)  DEFAULT 0                   COMMENT '固定资产投资(亿元)',
  FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='经济数据表-GDP产业结构投资按区域+年份查询最频繁';

CREATE INDEX idx_economy_region_year ON economy_data(region_id, year);
CREATE INDEX idx_economy_year ON economy_data(year);

-- ============================================================
-- 4. 人口数据表 -- 总人口、年龄结构、城乡分布、流动
-- ============================================================
CREATE TABLE population_data (
  id                INT          PRIMARY KEY AUTO_INCREMENT COMMENT '记录ID',
  region_id         INT          NOT NULL                    COMMENT '关联区域ID->regions.id',
  year              INT          NOT NULL                    COMMENT '年份(2021-2025)',
  total_population  INT          DEFAULT 0                   COMMENT '常住人口(万人)',
  urban_population  INT          DEFAULT 0                   COMMENT '城镇人口(万人)',
  rural_population  INT          DEFAULT 0                   COMMENT '农村人口(万人)',
  male_population   INT          DEFAULT 0                   COMMENT '男性人口(万人)',
  female_population INT          DEFAULT 0                   COMMENT '女性人口(万人)',
  age_0_14          INT          DEFAULT 0                   COMMENT '0-14岁人口(万人)',
  age_15_59         INT          DEFAULT 0                   COMMENT '15-59岁人口(万人)',
  age_60_plus       INT          DEFAULT 0                   COMMENT '60岁以上人口(万人)',
  net_inflow        INT          DEFAULT 0                   COMMENT '净迁入人口(万人负数=净迁出)',
  FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='人口数据表-年龄性别城乡流动结构按区域+年份查询';

CREATE INDEX idx_population_region_year ON population_data(region_id, year);
CREATE INDEX idx_population_year ON population_data(year);

-- ============================================================
-- 5. 交通数据表 -- 拥堵指数、公共交通运量、事故
--    日+小时双粒度(hour=NULL表示日汇总)
-- ============================================================
CREATE TABLE traffic_data (
  id                INT          PRIMARY KEY AUTO_INCREMENT COMMENT '记录ID',
  region_id         INT          NOT NULL                    COMMENT '关联区域ID->regions.id',
  record_date       DATE         NOT NULL                    COMMENT '记录日期',
  hour              TINYINT                                  COMMENT '小时(0-23,NULL=日汇总)',
  congestion_index  DECIMAL(4,2) DEFAULT 0                   COMMENT '拥堵指数(1.0=畅通2.0=严重拥堵)',
  bus_ridership     INT          DEFAULT 0                   COMMENT '公交客运量(万人次)',
  metro_ridership   INT          DEFAULT 0                   COMMENT '地铁客运量(万人次)',
  taxi_ridership    INT          DEFAULT 0                   COMMENT '出租车客运量(万人次)',
  accidents         INT          DEFAULT 0                   COMMENT '交通事故数(起)',
  FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='交通数据表-拥堵运量事故日+小时双粒度';

CREATE INDEX idx_traffic_region_date ON traffic_data(region_id, record_date);
CREATE INDEX idx_traffic_date ON traffic_data(record_date);

-- ============================================================
-- 6. 环境数据表 -- AQI、污染物浓度、水质、绿化
-- ============================================================
CREATE TABLE environment_data (
  id             INT            PRIMARY KEY AUTO_INCREMENT COMMENT '记录ID',
  region_id      INT            NOT NULL                    COMMENT '关联区域ID->regions.id',
  record_date    DATE           NOT NULL                    COMMENT '记录日期',
  aqi            INT            DEFAULT 0                   COMMENT '空气质量指数(0-500)',
  pm25           DECIMAL(6,2)   DEFAULT 0                   COMMENT 'PM2.5浓度(ug/m3)',
  pm10           DECIMAL(6,2)   DEFAULT 0                   COMMENT 'PM10浓度(ug/m3)',
  o3             DECIMAL(6,2)   DEFAULT 0                   COMMENT '臭氧浓度(ug/m3)',
  no2            DECIMAL(6,2)   DEFAULT 0                   COMMENT '二氧化氮浓度(ug/m3)',
  so2            DECIMAL(6,2)   DEFAULT 0                   COMMENT '二氧化硫浓度(ug/m3)',
  water_quality  VARCHAR(20)    DEFAULT ''                  COMMENT '水质等级(I类II类III类IV类V类)',
  green_coverage DECIMAL(5,2)   DEFAULT 0                   COMMENT '绿化覆盖率(%)',
  FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='环境数据表-AQI污染物水质绿化按区域+日期查询';

CREATE INDEX idx_environment_region_date ON environment_data(region_id, record_date);
CREATE INDEX idx_environment_date ON environment_data(record_date);
