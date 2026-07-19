import { describe, expect, it } from 'vitest'
import { createApp } from 'vue'
import LumalDatav, * as datav from '../src'

const upstreamMappings = [
  ...Array.from({ length: 13 }, (_, index) => [`borderBox${index + 1}`, 'LumalBorderBox'] as const),
  ...Array.from({ length: 12 }, (_, index) => [`decoration${index + 1}`, 'LumalDecoration'] as const),
  ['fullScreenContainer', 'LumalFullScreenContainer'],
  ['loading', 'LumalLoading'],
  ['charts', 'LumalCharts'],
  ['activeRingChart', 'LumalActiveRingChart'],
  ['capsuleChart', 'LumalCapsuleChart'],
  ['waterLevelPond', 'LumalWaterLevelPond'],
  ['percentPond', 'LumalPercentPond'],
  ['digitalFlop', 'LumalDigitalFlop'],
  ['flylineChart', 'LumalFlylineChart'],
  ['flylineChartEnhanced', 'LumalFlylineChartEnhanced'],
  ['conicalColumnChart', 'LumalConicalColumnChart'],
  ['scrollBoard', 'LumalScrollBoard'],
  ['scrollRankingBoard', 'LumalScrollRankingBoard'],
] as const

describe('@lumal/datav public API', () => {
  it('完整映射 DataV 2.10.0 的 38 个组件', () => {
    expect(upstreamMappings).toHaveLength(38)
    expect(new Set(upstreamMappings.map(([name]) => name)).size).toBe(38)

    for (const [, exportName] of upstreamMappings)
      expect(datav[exportName]).toBeDefined()
  })

  it('根 install 注册全部 15 个 Vue 3 组件入口', () => {
    const app = createApp({})
    app.use(LumalDatav)

    const componentNames = new Set(upstreamMappings.map(([, name]) => name))
    expect(componentNames.size).toBe(15)
    for (const name of componentNames)
      expect(app.component(name)).toBe(datav[name])
  })

  it('每个按需组件都提供 install', () => {
    for (const name of new Set(upstreamMappings.map(([, exportName]) => exportName)))
      expect(datav[name]).toMatchObject({ install: expect.any(Function) })
  })
})
