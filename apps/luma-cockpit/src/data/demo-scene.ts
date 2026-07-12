declare namespace GeoJSON {
  interface Polygon {
    type: 'Polygon'
    coordinates: number[][][]
  }

  interface Feature {
    type: 'Feature'
    properties: Record<string, unknown>
    geometry: Polygon
  }

  interface FeatureCollection {
    type: 'FeatureCollection'
    features: Feature[]
  }
}

export interface DemoGeoScene {
  geoJson: GeoJSON.FeatureCollection
  regions: Array<{
    id: string
    name: string
    value: number
    status?: string
  }>
  points: Array<{
    id: string
    name: string
    coordinate: [number, number]
    value: number
    status?: string
  }>
  lines?: Array<{
    id: string
    from: [number, number]
    to: [number, number]
    value?: number
  }>
  selectedIds: string[]
}

export const demoScene: DemoGeoScene = {
  geoJson: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { id: 'north', name: '北部区域' },
        geometry: {
          type: 'Polygon',
          coordinates: [[[0, 50], [42, 62], [54, 36], [26, 24], [0, 34], [0, 50]]],
        },
      },
      {
        type: 'Feature',
        properties: { id: 'center', name: '中心区域' },
        geometry: {
          type: 'Polygon',
          coordinates: [[[26, 24], [54, 36], [76, 20], [70, -8], [36, -18], [12, 0], [26, 24]]],
        },
      },
      {
        type: 'Feature',
        properties: { id: 'south', name: '南部区域' },
        geometry: {
          type: 'Polygon',
          coordinates: [[[12, 0], [36, -18], [70, -8], [92, -34], [64, -58], [18, -48], [-6, -20], [12, 0]]],
        },
      },
      {
        type: 'Feature',
        properties: { id: 'east', name: '东部区域' },
        geometry: {
          type: 'Polygon',
          coordinates: [[[54, 36], [100, 44], [118, 16], [98, -18], [70, -8], [76, 20], [54, 36]]],
        },
      },
    ],
  },
  regions: [
    { id: 'north', name: '北部区域', value: 86, status: 'stable' },
    { id: 'center', name: '中心区域', value: 93, status: 'active' },
    { id: 'south', name: '南部区域', value: 68, status: 'watch' },
    { id: 'east', name: '东部区域', value: 74, status: 'stable' },
  ],
  points: [
    { id: 'p-alpha', name: '节点 Alpha', coordinate: [28, 40], value: 92, status: 'active' },
    { id: 'p-beta', name: '节点 Beta', coordinate: [48, 8], value: 78, status: 'stable' },
    { id: 'p-gamma', name: '节点 Gamma', coordinate: [76, -36], value: 64, status: 'watch' },
    { id: 'p-delta', name: '节点 Delta', coordinate: [94, 18], value: 71, status: 'stable' },
  ],
  lines: [
    { id: 'l-alpha-beta', from: [28, 40], to: [48, 8], value: 32 },
    { id: 'l-beta-gamma', from: [48, 8], to: [76, -36], value: 24 },
    { id: 'l-beta-delta', from: [48, 8], to: [94, 18], value: 28 },
  ],
  selectedIds: [],
}

export const metricSummaries = [
  { label: '总量', value: '1,284', trend: '+8.6%' },
  { label: '在线', value: '968', trend: '+4.2%' },
  { label: '待处理', value: '42', trend: '-3.1%' },
  { label: '完成率', value: '93.4%', trend: '+1.8%' },
]

export const trendSeries = [
  { label: '稳定', values: [42, 48, 54, 51, 62, 68, 72], status: 'stable' },
  { label: '活跃', values: [28, 34, 32, 45, 49, 53, 61], status: 'active' },
  { label: '观察', values: [18, 22, 19, 24, 27, 25, 21], status: 'watch' },
]

export const demoEvents = [
  { id: 'e-1', title: '节点 Alpha 指标提升', targetId: 'p-alpha', level: 'info', time: '09:20' },
  { id: 'e-2', title: '南部区域进入观察', targetId: 'south', level: 'warning', time: '10:05' },
  { id: 'e-3', title: '中心区域完成同步', targetId: 'center', level: 'success', time: '10:42' },
  { id: 'e-4', title: '节点 Gamma 等待复核', targetId: 'p-gamma', level: 'warning', time: '11:10' },
]

export const statusDistribution = [
  { label: '稳定', value: 58, status: 'stable' },
  { label: '活跃', value: 27, status: 'active' },
  { label: '观察', value: 15, status: 'watch' },
]
