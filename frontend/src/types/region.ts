/** 区域层级枚举 */
export enum RegionLevel {
  PROVINCE = 1,
  CITY = 2,
  DISTRICT = 3
}

/** 区域信息 */
export interface Region {
  id: number
  name: string
  level: RegionLevel
  parentId: number | null
  areaCode: string
  longitude: number
  latitude: number
}

/** 面包屑导航节点 */
export interface RegionPathNode {
  id: number
  name: string
  level: RegionLevel
}

/** 地图着色数据项 */
export interface MapDataItem {
  name: string
  value: number
}
