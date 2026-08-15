import { query } from '../config/db'
import type { Region } from '../types'

/**
 * 校验区域是否存在（所有业务接口的通用前置检查）
 * 不存在则抛出 { status: 404 } 业务错误
 */
export const verifyRegionExists = async (regionId: number): Promise<void> => {
  const rows = await query<{ id: number }[]>('SELECT id FROM regions WHERE id = ?', [regionId])
  if (rows.length === 0) {
    throw { status: 404, message: `区域不存在（id: ${regionId}）` }
  }
}

/** 省级区域列表（地图初始加载） */
export const getProvinces = async (): Promise<Region[]> => {
  return query<Region[]>(
    `SELECT id, name, level, parent_id AS parentId, area_code AS areaCode, longitude, latitude
     FROM regions
     WHERE level = 1
     ORDER BY id`
  )
}

/** 直接子区域列表（地图下钻：省→市→区县） */
export const getChildren = async (regionId: number): Promise<Region[]> => {
  await verifyRegionExists(regionId)
  return query<Region[]>(
    `SELECT id, name, level, parent_id AS parentId, area_code AS areaCode, longitude, latitude
     FROM regions
     WHERE parent_id = ?
     ORDER BY id`,
    [regionId]
  )
}
