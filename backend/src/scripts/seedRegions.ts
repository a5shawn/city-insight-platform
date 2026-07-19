/**
 * seedRegions.ts — 区域数据种子脚本
 *
 * 生成安徽省 → 16市 → 区县 三级区域数据
 * 数据来源：安徽省行政区划（2023年标准）
 *
 * 运行：npx tsx src/scripts/seedRegions.ts
 */

import { query, batchInsert, truncate, closePool } from '../config/db'

// ============================================================
// 区域数据（parentId 在运行时动态获取）
// ============================================================

const PROVINCE = {
  name: '安徽省',
  level: 1 as const,
  areaCode: '340000',
  longitude: 117.283_042,
  latitude: 31.861_19,
}

interface CityData {
  name: string
  areaCode: string
  longitude: number
  latitude: number
  districts: { name: string; areaCode: string; longitude: number; latitude: number }[]
}

// 安徽省 16市 + 区县（按 CITIES 插入顺序排列）
const CITY_DATA: CityData[] = [
  {
    name: '合肥市',
    areaCode: '340100',
    longitude: 117.283_042,
    latitude: 31.861_19,
    districts: [
      { name: '瑶海区', areaCode: '340102', longitude: 117.309_229, latitude: 31.858_048 },
      { name: '庐阳区', areaCode: '340103', longitude: 117.264_595, latitude: 31.878_641 },
      { name: '蜀山区', areaCode: '340104', longitude: 117.260_536, latitude: 31.851_157 },
      { name: '包河区', areaCode: '340111', longitude: 117.309_658, latitude: 31.793_093 },
      { name: '长丰县', areaCode: '340121', longitude: 117.167_564, latitude: 32.478_018 },
      { name: '肥东县', areaCode: '340122', longitude: 117.469_383, latitude: 31.887_94 },
      { name: '肥西县', areaCode: '340123', longitude: 117.157_981, latitude: 31.706_809 },
      { name: '庐江县', areaCode: '340124', longitude: 117.287_8, latitude: 31.255_61 },
      { name: '巢湖市', areaCode: '340181', longitude: 117.861_804, latitude: 31.598_628 },
    ],
  },
  {
    name: '滁州市',
    areaCode: '341100',
    longitude: 118.316_827,
    latitude: 32.303_627,
    districts: [
      { name: '琅琊区', areaCode: '341102', longitude: 118.305_843, latitude: 32.294_53 },
      { name: '南谯区', areaCode: '341103', longitude: 118.296_955, latitude: 32.329_842 },
      { name: '天长市', areaCode: '341181', longitude: 119.004_817, latitude: 32.667_571 },
      { name: '明光市', areaCode: '341182', longitude: 117.989_048, latitude: 32.781_986 },
      { name: '来安县', areaCode: '341122', longitude: 118.435_731, latitude: 32.452_165 },
      { name: '全椒县', areaCode: '341124', longitude: 118.274_149, latitude: 32.085_301 },
      { name: '定远县', areaCode: '341125', longitude: 117.698_563, latitude: 32.530_018 },
      { name: '凤阳县', areaCode: '341126', longitude: 117.561_622, latitude: 32.866_17 },
    ],
  },
  {
    name: '六安市',
    areaCode: '341500',
    longitude: 116.507_676,
    latitude: 31.752_889,
    districts: [
      { name: '金安区', areaCode: '341502', longitude: 116.539_179, latitude: 31.749_265 },
      { name: '裕安区', areaCode: '341503', longitude: 116.479_828, latitude: 31.737_813 },
      { name: '叶集区', areaCode: '341504', longitude: 115.925_271, latitude: 31.885_664 },
      { name: '霍邱县', areaCode: '341522', longitude: 116.277_912, latitude: 32.353_038 },
      { name: '舒城县', areaCode: '341523', longitude: 116.948_736, latitude: 31.462_027 },
      { name: '金寨县', areaCode: '341524', longitude: 115.934_266, latitude: 31.727_17 },
      { name: '霍山县', areaCode: '341525', longitude: 116.332_789, latitude: 31.392_876 },
    ],
  },
  {
    name: '安庆市',
    areaCode: '340800',
    longitude: 117.043_551,
    latitude: 30.508_83,
    districts: [
      { name: '迎江区', areaCode: '340802', longitude: 117.091_15, latitude: 30.511_548 },
      { name: '大观区', areaCode: '340803', longitude: 117.013_713, latitude: 30.553_697 },
      { name: '宜秀区', areaCode: '340811', longitude: 116.987_542, latitude: 30.613_332 },
      { name: '桐城市', areaCode: '340881', longitude: 116.974_12, latitude: 31.035_8 },
      { name: '怀宁县', areaCode: '340822', longitude: 116.829_751, latitude: 30.738_825 },
      { name: '太湖县', areaCode: '340825', longitude: 116.308_795, latitude: 30.454_22 },
      { name: '宿松县', areaCode: '340826', longitude: 116.129_105, latitude: 30.153_746 },
      { name: '望江县', areaCode: '340827', longitude: 116.694_183, latitude: 30.124_443 },
      { name: '岳西县', areaCode: '340828', longitude: 116.359_921, latitude: 30.849_442 },
      { name: '潜山市', areaCode: '340882', longitude: 116.581_371, latitude: 30.631_129 },
    ],
  },
  {
    name: '阜阳市',
    areaCode: '341200',
    longitude: 115.819_729,
    latitude: 32.896_969,
    districts: [
      { name: '颍州区', areaCode: '341202', longitude: 115.806_942, latitude: 32.883_468 },
      { name: '颍东区', areaCode: '341203', longitude: 115.856_762, latitude: 32.909_48 },
      { name: '颍泉区', areaCode: '341204', longitude: 115.808_327, latitude: 32.924_918 },
      { name: '界首市', areaCode: '341282', longitude: 115.374_564, latitude: 33.257_013 },
      { name: '临泉县', areaCode: '341221', longitude: 115.261_473, latitude: 33.040_261 },
      { name: '太和县', areaCode: '341222', longitude: 115.621_934, latitude: 33.160_326 },
      { name: '阜南县', areaCode: '341225', longitude: 115.595_644, latitude: 32.658_297 },
      { name: '颍上县', areaCode: '341226', longitude: 116.256_789, latitude: 32.653_211 },
    ],
  },
  {
    name: '宿州市',
    areaCode: '341300',
    longitude: 116.984_084,
    latitude: 33.633_891,
    districts: [
      { name: '埇桥区', areaCode: '341302', longitude: 116.977_463, latitude: 33.640_477 },
      { name: '砀山县', areaCode: '341321', longitude: 116.367_095, latitude: 34.442_561 },
      { name: '萧县', areaCode: '341322', longitude: 116.947_29, latitude: 34.188_728 },
      { name: '灵璧县', areaCode: '341323', longitude: 117.558_665, latitude: 33.543_862 },
      { name: '泗县', areaCode: '341324', longitude: 117.910_629, latitude: 33.482_982 },
    ],
  },
  {
    name: '淮北市',
    areaCode: '340600',
    longitude: 116.794_664,
    latitude: 33.971_707,
    districts: [
      { name: '杜集区', areaCode: '340602', longitude: 116.828_134, latitude: 33.991_451 },
      { name: '相山区', areaCode: '340603', longitude: 116.794_344, latitude: 33.959_893 },
      { name: '烈山区', areaCode: '340604', longitude: 116.813_042, latitude: 33.895_139 },
      { name: '濉溪县', areaCode: '340621', longitude: 116.766_299, latitude: 33.915_477 },
    ],
  },
  {
    name: '亳州市',
    areaCode: '341600',
    longitude: 115.782_939,
    latitude: 33.869_338,
    districts: [
      { name: '谯城区', areaCode: '341602', longitude: 115.779_025, latitude: 33.876_235 },
      { name: '涡阳县', areaCode: '341621', longitude: 116.215_665, latitude: 33.509_278 },
      { name: '蒙城县', areaCode: '341622', longitude: 116.564_248, latitude: 33.265_831 },
      { name: '利辛县', areaCode: '341623', longitude: 116.208_564, latitude: 33.144_724 },
    ],
  },
  {
    name: '蚌埠市',
    areaCode: '340300',
    longitude: 117.363_228,
    latitude: 32.939_667,
    districts: [
      { name: '龙子湖区', areaCode: '340302', longitude: 117.393_79, latitude: 32.943_014 },
      { name: '蚌山区', areaCode: '340303', longitude: 117.367_614, latitude: 32.944_198 },
      { name: '禹会区', areaCode: '340304', longitude: 117.353_156, latitude: 32.939_364 },
      { name: '淮上区', areaCode: '340311', longitude: 117.359_477, latitude: 32.965_435 },
      { name: '怀远县', areaCode: '340321', longitude: 117.205_234, latitude: 32.970_031 },
      { name: '五河县', areaCode: '340322', longitude: 117.879_486, latitude: 33.127_823 },
      { name: '固镇县', areaCode: '340323', longitude: 117.316_955, latitude: 33.316_899 },
    ],
  },
  {
    name: '淮南市',
    areaCode: '340400',
    longitude: 117.018_329,
    latitude: 32.647_574,
    districts: [
      { name: '大通区', areaCode: '340402', longitude: 117.053_273, latitude: 32.631_521 },
      { name: '田家庵区', areaCode: '340403', longitude: 117.017_409, latitude: 32.647_155 },
      { name: '谢家集区', areaCode: '340404', longitude: 116.859_048, latitude: 32.599_901 },
      { name: '八公山区', areaCode: '340405', longitude: 116.833_49, latitude: 32.631_379 },
      { name: '潘集区', areaCode: '340406', longitude: 116.834_716, latitude: 32.772_08 },
      { name: '凤台县', areaCode: '340421', longitude: 116.711_051, latitude: 32.709_445 },
      { name: '寿县', areaCode: '340422', longitude: 116.787_141, latitude: 32.573_306 },
    ],
  },
  {
    name: '芜湖市',
    areaCode: '340200',
    longitude: 118.376_451,
    latitude: 31.326_319,
    districts: [
      { name: '镜湖区', areaCode: '340202', longitude: 118.385_009, latitude: 31.340_728 },
      { name: '弋江区', areaCode: '340203', longitude: 118.377_476, latitude: 31.312_39 },
      { name: '鸠江区', areaCode: '340207', longitude: 118.391_734, latitude: 31.369_374 },
      { name: '三山区', areaCode: '340208', longitude: 118.268_101, latitude: 31.219_568 },
      { name: '芜湖县', areaCode: '340221', longitude: 118.576_124, latitude: 31.134_809 },
      { name: '繁昌县', areaCode: '340222', longitude: 118.201_349, latitude: 31.080_896 },
      { name: '南陵县', areaCode: '340223', longitude: 118.334_104, latitude: 30.914_923 },
    ],
  },
  {
    name: '马鞍山市',
    areaCode: '340500',
    longitude: 118.507_906,
    latitude: 31.689_362,
    districts: [
      { name: '花山区', areaCode: '340503', longitude: 118.493_103, latitude: 31.719_71 },
      { name: '雨山区', areaCode: '340504', longitude: 118.498_56, latitude: 31.689_213 },
      { name: '博望区', areaCode: '340506', longitude: 118.844_538, latitude: 31.558_471 },
      { name: '当涂县', areaCode: '340521', longitude: 118.496_779, latitude: 31.571_049 },
      { name: '含山县', areaCode: '340522', longitude: 118.101_421, latitude: 31.735_599 },
      { name: '和县', areaCode: '340523', longitude: 118.351_405, latitude: 31.741_794 },
    ],
  },
  {
    name: '铜陵市',
    areaCode: '340700',
    longitude: 117.816_576,
    latitude: 30.929_935,
    districts: [
      { name: '铜官区', areaCode: '340705', longitude: 117.856_174, latitude: 30.936_272 },
      { name: '义安区', areaCode: '340706', longitude: 117.791_544, latitude: 30.952_823 },
      { name: '郊区', areaCode: '340711', longitude: 117.807_07, latitude: 30.908_927 },
      { name: '枞阳县', areaCode: '340722', longitude: 117.250_595, latitude: 30.706_627 },
    ],
  },
  {
    name: '宣城市',
    areaCode: '341800',
    longitude: 118.757_995,
    latitude: 30.945_667,
    districts: [
      { name: '宣州区', areaCode: '341802', longitude: 118.756_328, latitude: 30.944_076 },
      { name: '宁国市', areaCode: '341881', longitude: 118.983_406, latitude: 30.633_882 },
      { name: '广德市', areaCode: '341882', longitude: 119.416_797, latitude: 30.893_555 },
      { name: '郎溪县', areaCode: '341821', longitude: 119.179_657, latitude: 31.126_412 },
      { name: '泾县', areaCode: '341823', longitude: 118.419_731, latitude: 30.688_578 },
      { name: '绩溪县', areaCode: '341824', longitude: 118.578_519, latitude: 30.067_377 },
      { name: '旌德县', areaCode: '341825', longitude: 118.540_487, latitude: 30.286_35 },
    ],
  },
  {
    name: '黄山市',
    areaCode: '341000',
    longitude: 118.317_325,
    latitude: 29.709_239,
    districts: [
      { name: '屯溪区', areaCode: '341002', longitude: 118.315_329, latitude: 29.696_11 },
      { name: '黄山区', areaCode: '341003', longitude: 118.141_568, latitude: 30.272_942 },
      { name: '徽州区', areaCode: '341004', longitude: 118.336_751, latitude: 29.827_279 },
      { name: '歙县', areaCode: '341021', longitude: 118.415_356, latitude: 29.861_308 },
      { name: '休宁县', areaCode: '341022', longitude: 118.199_179, latitude: 29.789_095 },
      { name: '黟县', areaCode: '341023', longitude: 117.938_373, latitude: 29.924_805 },
      { name: '祁门县', areaCode: '341024', longitude: 117.717_396, latitude: 29.854_055 },
    ],
  },
  {
    name: '池州市',
    areaCode: '341700',
    longitude: 117.489_157,
    latitude: 30.656_037,
    districts: [
      { name: '贵池区', areaCode: '341702', longitude: 117.567_379, latitude: 30.687_08 },
      { name: '东至县', areaCode: '341721', longitude: 117.027_618, latitude: 30.111_163 },
      { name: '石台县', areaCode: '341722', longitude: 117.486_304, latitude: 30.210_313 },
      { name: '青阳县', areaCode: '341723', longitude: 117.847_43, latitude: 30.639_23 },
    ],
  },
]

// ============================================================
// 主逻辑
// ============================================================
async function main() {
  console.log('🗑️  清空 regions 表...')
  await truncate('regions')

  // 1. 插入省份
  console.log('📌 插入省份：安徽省')
  await batchInsert(
    'regions',
    ['name', 'level', 'parent_id', 'area_code', 'longitude', 'latitude'],
    [
      [
        PROVINCE.name,
        PROVINCE.level,
        null,
        PROVINCE.areaCode,
        PROVINCE.longitude,
        PROVINCE.latitude,
      ],
    ]
  )
  console.log('   ✅ 安徽省 (id=1)')

  // 2. 插入16市
  console.log('📌 插入 16 市...')
  const cityRows = CITY_DATA.map((c) => [c.name, 2, 1, c.areaCode, c.longitude, c.latitude])
  await batchInsert(
    'regions',
    ['name', 'level', 'parent_id', 'area_code', 'longitude', 'latitude'],
    cityRows
  )
  console.log('   ✅ 16 市')

  // 3. 从数据库读取城市ID映射
  const cities = await query<{ id: number; name: string }[]>(
    'SELECT id, name FROM regions WHERE level = 2 ORDER BY id'
  )
  const cityIdMap = new Map(cities.map((c) => [c.name, c.id]))
  console.log(`   📊 城市ID映射：${cityIdMap.size} 个`)

  // 4. 插入区县（parentId 从数据库动态获取）
  console.log('📌 插入区县...')
  let totalDistricts = 0

  for (const city of CITY_DATA) {
    const parentId = cityIdMap.get(city.name)
    if (!parentId) {
      console.warn(`   ⚠️  未找到城市：${city.name}，跳过区县`)
      continue
    }

    const districtRows = city.districts.map((d) => [
      d.name,
      3,
      parentId,
      d.areaCode,
      d.longitude,
      d.latitude,
    ])
    await batchInsert(
      'regions',
      ['name', 'level', 'parent_id', 'area_code', 'longitude', 'latitude'],
      districtRows
    )
    totalDistricts += city.districts.length
    console.log(`   ✅ ${city.name} (${city.districts.length} 个区县)`)
  }

  // 5. 验证
  const [result] = await query<any>('SELECT COUNT(*) as count FROM regions')
  const [lv1] = await query<any>('SELECT COUNT(*) as count FROM regions WHERE level = 1')
  const [lv2] = await query<any>('SELECT COUNT(*) as count FROM regions WHERE level = 2')
  const [lv3] = await query<any>('SELECT COUNT(*) as count FROM regions WHERE level = 3')

  console.log(`\n📊 总计：${result.count} 条`)
  console.log(`   省：${lv1.count} | 市：${lv2.count} | 区县：${lv3.count}`)

  await closePool()
  console.log('\n✅ 区域数据种子完成！')
}

main().catch((err) => {
  console.error('❌ 种子脚本失败：', err)
  process.exit(1)
})
