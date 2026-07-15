import chinaGeoJsonSource from 'china-geojson/src/geojson/china.json'

export type SceneStatus = 'stable' | 'active' | 'watch'
export type SceneCoordinate = [number, number]

export interface SceneRegion {
  id: string
  name: string
  center: SceneCoordinate
  value: number
  status: SceneStatus
}

export interface ScenePoint {
  id: string
  name: string
  regionId: string
  coordinate: SceneCoordinate
  value: number
  status: SceneStatus
}

export interface SceneLine {
  id: string
  fromId: string
  toId: string
  from: SceneCoordinate
  to: SceneCoordinate
  coordinates: SceneCoordinate[]
  value: number
  status: SceneStatus
}

export interface SceneFeatureProperties {
  id?: string
  name: string
  cp?: SceneCoordinate
  longitude?: number
  latitude?: number
  regionId?: string
  value?: number
  status?: SceneStatus
}

export interface ScenePolygonGeometry {
  type: 'Polygon'
  coordinates: number[][][]
}

export interface SceneMultiPolygonGeometry {
  type: 'MultiPolygon'
  coordinates: number[][][][]
}

export interface SceneGeoJsonFeature {
  type: 'Feature'
  properties: SceneFeatureProperties
  geometry: ScenePolygonGeometry | SceneMultiPolygonGeometry
}

export interface SceneGeoJson {
  type: 'FeatureCollection'
  features: SceneGeoJsonFeature[]
}

export interface DemoGeoScene {
  geoJson: SceneGeoJson
  regions: SceneRegion[]
  points: ScenePoint[]
  lines: SceneLine[]
  selectedIds: string[]
}

interface PointDefinition {
  id: string
  name: string
  regionName: string
  coordinate: SceneCoordinate
  value: number
}

const chinaGeoJson = chinaGeoJsonSource as unknown as SceneGeoJson
const regionCodesByName: Record<string, string> = {
  香港: '81',
  澳门: '82',
}

function statusForValue(value: number): SceneStatus {
  if (value >= 86)
    return 'active'
  if (value >= 73)
    return 'stable'
  return 'watch'
}

function featureCenter(feature: SceneGeoJsonFeature): SceneCoordinate {
  const { cp, longitude, latitude } = feature.properties
  if (cp)
    return [...cp] as SceneCoordinate
  if (typeof longitude === 'number' && typeof latitude === 'number')
    return [longitude, latitude]
  return [104, 35]
}

function featureCode(feature: SceneGeoJsonFeature, index: number): string {
  return feature.properties.id ?? regionCodesByName[feature.properties.name] ?? `feature-${index}`
}

const regions: SceneRegion[] = chinaGeoJson.features
  .filter(feature => feature.properties.name !== '南海诸岛')
  .map((feature, index) => {
    const code = featureCode(feature, index)
    const numericId = Number.parseInt(code, 10) || index
    const value = 64 + ((numericId * 11 + index * 7) % 34)
    return {
      id: `r-${code}`,
      name: feature.properties.name,
      center: featureCenter(feature),
      value,
      status: statusForValue(value),
    }
  })

const regionByName = new Map(regions.map(region => [region.name, region]))

const pointDefinitions: PointDefinition[] = [
  { id: 'p-beijing', name: '北京枢纽', regionName: '北京', coordinate: [116.4074, 39.9042], value: 96 },
  { id: 'p-shanghai', name: '上海枢纽', regionName: '上海', coordinate: [121.4737, 31.2304], value: 92 },
  { id: 'p-guangzhou', name: '广州枢纽', regionName: '广东', coordinate: [113.2644, 23.1291], value: 89 },
  { id: 'p-shenzhen', name: '深圳节点', regionName: '广东', coordinate: [114.0579, 22.5431], value: 84 },
  { id: 'p-wuhan', name: '武汉中心', regionName: '湖北', coordinate: [114.3055, 30.5928], value: 98 },
  { id: 'p-chengdu', name: '成都节点', regionName: '四川', coordinate: [104.0665, 30.5723], value: 81 },
  { id: 'p-xian', name: '西安节点', regionName: '陕西', coordinate: [108.9398, 34.3416], value: 77 },
  { id: 'p-hangzhou', name: '杭州节点', regionName: '浙江', coordinate: [120.1551, 30.2741], value: 87 },
  { id: 'p-urumqi', name: '乌鲁木齐节点', regionName: '新疆', coordinate: [87.6168, 43.8256], value: 69 },
  { id: 'p-haikou', name: '海口节点', regionName: '海南', coordinate: [110.1983, 20.044], value: 72 },
]

const points: ScenePoint[] = pointDefinitions.map((point) => {
  const region = regionByName.get(point.regionName)
  if (!region)
    throw new Error(`未找到节点对应区域：${point.regionName}`)
  return {
    ...point,
    regionId: region.id,
    status: statusForValue(point.value),
  }
})

const mainHub = points.find(point => point.id === 'p-wuhan')
if (!mainHub)
  throw new Error('未找到飞线中心节点')

function createArc(from: SceneCoordinate, to: SceneCoordinate, index: number): SceneCoordinate[] {
  const dx = to[0] - from[0]
  const dy = to[1] - from[1]
  const distance = Math.hypot(dx, dy)
  if (distance < 0.01)
    return [from, to]

  const direction = index % 2 === 0 ? 1 : -1
  const curve = Math.min(5.2, Math.max(1.1, distance * 0.12)) * direction
  const normalX = -dy / distance
  const normalY = dx / distance
  const coordinates: SceneCoordinate[] = []

  for (let step = 0; step <= 24; step += 1) {
    const progress = step / 24
    const offset = Math.sin(Math.PI * progress) * curve
    coordinates.push([
      from[0] + dx * progress + normalX * offset,
      from[1] + dy * progress + normalY * offset,
    ])
  }
  return coordinates
}

const lines: SceneLine[] = regions
  .filter(region => region.id !== mainHub.regionId)
  .map((region, index) => ({
    id: `l-${mainHub.id}-${region.id}`,
    fromId: mainHub.id,
    toId: region.id,
    from: mainHub.coordinate,
    to: region.center,
    coordinates: createArc(mainHub.coordinate, region.center, index),
    value: region.value,
    status: region.status,
  }))

const geoJson: SceneGeoJson = {
  type: 'FeatureCollection',
  features: chinaGeoJson.features.map((feature) => {
    const region = regionByName.get(feature.properties.name)
    return {
      ...feature,
      properties: {
        ...feature.properties,
        regionId: region?.id,
        value: region?.value,
        status: region?.status,
      },
    }
  }),
}

export const demoScene: DemoGeoScene = {
  geoJson,
  regions,
  points,
  lines,
  selectedIds: [],
}

export type SceneEntity = (SceneRegion & { kind: 'region' }) | (ScenePoint & { kind: 'point' })

const sceneEntityById = new Map<string, SceneEntity>([
  ...regions.map(region => [region.id, { ...region, kind: 'region' as const }] as const),
  ...points.map(point => [point.id, { ...point, kind: 'point' as const }] as const),
])

export function getSceneEntity(id?: string): SceneEntity | undefined {
  return id ? sceneEntityById.get(id) : undefined
}

export const metricSummaries = [
  { label: '接入区域', value: regions.length, unit: '个', trend: '全国省级节点', tone: 'cyan', visual: 'digital' as const },
  { label: '在线率', value: Math.round((points.filter(point => point.status !== 'watch').length / points.length) * 100), unit: '', trend: `在线 ${points.filter(point => point.status !== 'watch').length} / ${points.length}`, tone: 'green', visual: 'percent' as const },
  { label: '运行链路', value: lines.length, unit: '条', trend: `高负载 ${lines.filter(line => line.status === 'active').length} 条`, tone: 'blue', visual: 'digital' as const },
  { label: '综合指数', value: Math.round(regions.reduce((sum, region) => sum + region.value, 0) / regions.length), unit: '', trend: '较昨日 +2.8%', tone: 'amber', visual: 'percent' as const },
]

const trendPatterns: Record<SceneStatus, number[]> = {
  stable: [68, 72, 75, 73, 78, 81, 84],
  active: [54, 59, 63, 69, 74, 82, 89],
  watch: [32, 30, 35, 31, 28, 26, 24],
}

export const trendSeries = [
  { label: '运行平稳', values: trendPatterns.stable, status: 'stable' as const },
  { label: '高负载', values: trendPatterns.active, status: 'active' as const },
  { label: '待关注', values: trendPatterns.watch, status: 'watch' as const },
]

export const demoEvents = [
  { id: 'e-1', title: '北京枢纽负载升至 92%', targetId: 'p-beijing', level: 'warning', time: '09:20' },
  { id: 'e-2', title: '上海枢纽新增跨域连接', targetId: 'p-shanghai', level: 'info', time: '09:36' },
  { id: 'e-3', title: '广州枢纽完成链路切换', targetId: 'p-guangzhou', level: 'success', time: '09:52' },
  { id: 'e-4', title: '新疆区域链路波动超阈值', targetId: regionByName.get('新疆')?.id ?? '', level: 'danger', time: '10:05' },
  { id: 'e-5', title: '武汉中心完成全量同步', targetId: 'p-wuhan', level: 'success', time: '10:42' },
  { id: 'e-6', title: '成都节点恢复正常服务', targetId: 'p-chengdu', level: 'success', time: '10:58' },
  { id: 'e-7', title: '海南节点连续性等待复核', targetId: 'p-haikou', level: 'warning', time: '11:10' },
  { id: 'e-8', title: '杭州节点进入高负载状态', targetId: 'p-hangzhou', level: 'warning', time: '11:26' },
  { id: 'e-9', title: '西安节点完成策略下发', targetId: 'p-xian', level: 'info', time: '11:43' },
  { id: 'e-10', title: '深圳节点时延回落至 18ms', targetId: 'p-shenzhen', level: 'success', time: '12:02' },
]

const statusLabels: Record<SceneStatus, string> = {
  stable: '运行平稳',
  active: '高负载',
  watch: '待关注',
}

export const statusDistribution = (['stable', 'active', 'watch'] as const).map((status) => {
  const count = regions.filter(region => region.status === status).length
  return {
    label: statusLabels[status],
    value: Math.round((count / regions.length) * 100),
    count,
    status,
  }
})
