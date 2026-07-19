import { ref, computed } from 'vue'
import type { Region, RegionPathNode } from '@/types'
import { RegionLevel } from '@/enums'

/** 地图下钻状态组合式函数 */
export function useMap() {
  const currentRegion = ref<Region>({
    id: 1,
    name: '安徽省',
    level: RegionLevel.PROVINCE,
    parentId: null,
    areaCode: '340000',
    longitude: 117.3,
    latitude: 31.8
  })

  const regionPath = ref<RegionPathNode[]>([
    { id: 1, name: '安徽省', level: RegionLevel.PROVINCE }
  ])

  const isProvinceLevel = computed(() => currentRegion.value.level === RegionLevel.PROVINCE)
  const isCityLevel = computed(() => currentRegion.value.level === RegionLevel.CITY)
  const isDistrictLevel = computed(() => currentRegion.value.level === RegionLevel.DISTRICT)

  const drillDown = (region: Region) => {
    currentRegion.value = region
    regionPath.value.push({
      id: region.id,
      name: region.name,
      level: region.level
    })
  }

  const drillUp = (targetLevel?: RegionLevel) => {
    if (targetLevel !== undefined) {
      while (regionPath.value.length > 1 && regionPath.value[regionPath.value.length - 1].level > targetLevel) {
        regionPath.value.pop()
      }
    } else if (regionPath.value.length > 1) {
      regionPath.value.pop()
    }
    const parent = regionPath.value[regionPath.value.length - 1]
    currentRegion.value = {
      id: parent.id,
      name: parent.name,
      level: parent.level,
      parentId: regionPath.value.length > 1 ? regionPath.value[regionPath.value.length - 2].id : null,
      areaCode: '',
      longitude: 0,
      latitude: 0
    }
  }

  const navigateToPath = (index: number) => {
    if (index < regionPath.value.length - 1) {
      regionPath.value = regionPath.value.slice(0, index + 1)
      const target = regionPath.value[index]
      currentRegion.value = {
        id: target.id,
        name: target.name,
        level: target.level,
        parentId: index > 0 ? regionPath.value[index - 1].id : null,
        areaCode: '',
        longitude: 0,
        latitude: 0
      }
    }
  }

  const resetToProvince = () => {
    currentRegion.value = {
      id: 1,
      name: '安徽省',
      level: RegionLevel.PROVINCE,
      parentId: null,
      areaCode: '340000',
      longitude: 117.3,
      latitude: 31.8
    }
    regionPath.value = [{ id: 1, name: '安徽省', level: RegionLevel.PROVINCE }]
  }

  return {
    currentRegion,
    regionPath,
    isProvinceLevel,
    isCityLevel,
    isDistrictLevel,
    drillDown,
    drillUp,
    navigateToPath,
    resetToProvince
  }
}
