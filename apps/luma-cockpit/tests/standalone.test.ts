import { afterEach, describe, expect, it } from 'vitest'
import { standaloneCockpitRegistry } from '../src/registry'
import { loadStandaloneConfig, saveStandaloneConfig } from '../src/services/config'
import {
  resetStandalonePreferences,
  setStandaloneThemeMode,
  STANDALONE_PREFERENCES_STORAGE_KEY,
  standalonePreferences,
  standaloneResolvedThemeMode,
} from '../src/services/preferences'

describe('独立驾驶舱应用', () => {
  afterEach(() => {
    resetStandalonePreferences()
    localStorage.clear()
  })

  it('注册了自己的业务模块', () => {
    expect(standaloneCockpitRegistry.resolveWidget('metric-summary')).toBeTruthy()
    expect(standaloneCockpitRegistry.resolveWidget('trend-panel')).toBeTruthy()
    expect(standaloneCockpitRegistry.resolveWidget('event-list')).toBeTruthy()
    expect(standaloneCockpitRegistry.resolveWidget('region-ranking')).toBeTruthy()
    expect(standaloneCockpitRegistry.resolveWidget('status-distribution')).toBeTruthy()
  })

  it('加载默认标准配置', () => {
    const config = loadStandaloneConfig()
    expect(config.schemaVersion).toBe(3)
    expect(config.layouts).toHaveLength(2)
    expect(config.layouts[0].left.columns[0].width).toBe(420)
    expect(config.layouts[0].right.columns[0].width).toBe(420)
    expect(config.layouts[0].left.rows.reduce((sum, row) => sum + row.height, 0)).toBe(100)
    expect(() => JSON.stringify(config)).not.toThrow()
  })

  it('保存后可从本地存储重新加载', () => {
    const config = loadStandaloneConfig()
    saveStandaloneConfig({ ...config, title: '自定义标题' })
    const reloaded = loadStandaloneConfig()
    expect(reloaded.title).toBe('自定义标题')
  })

  it('保存会标准化非法配置', () => {
    const config = loadStandaloneConfig()
    const saved = saveStandaloneConfig({ ...config, layouts: [] })
    expect(saved.layouts).toHaveLength(1)
    expect(saved.schemaVersion).toBe(3)
  })

  it('主题偏好独立持久化并输出解析模式', () => {
    setStandaloneThemeMode('dark')
    expect(standalonePreferences.value.theme.mode).toBe('dark')
    expect(standaloneResolvedThemeMode.value).toBe('dark')
    expect(localStorage.getItem(STANDALONE_PREFERENCES_STORAGE_KEY)).toContain('"mode":"dark"')
  })
})
