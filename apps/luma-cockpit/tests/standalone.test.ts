import { afterEach, describe, expect, it } from 'vitest'
import { standaloneCockpitRegistry } from '../src/registry'
import { loadStandaloneConfig, saveStandaloneConfig } from '../src/services/config'

describe('独立驾驶舱应用', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('注册了自己的中央组件与业务模块', () => {
    expect(standaloneCockpitRegistry.resolveCenter('standalone-center')).toBeTruthy()
    expect(standaloneCockpitRegistry.resolveWidget('standalone-widget')).toBeTruthy()
  })

  it('加载默认标准配置', () => {
    const config = loadStandaloneConfig()
    expect(config.schemaVersion).toBe(1)
    expect(config.categories.length).toBeGreaterThan(0)
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
    const saved = saveStandaloneConfig({ ...config, categories: [] })
    expect(saved.categories).toEqual([])
    expect(saved.schemaVersion).toBe(1)
  })
})
