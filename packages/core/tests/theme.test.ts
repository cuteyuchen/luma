import { describe, expect, it } from 'vitest'
import {
  applyThemePreferences,
  applyThemeToElement,
  createDefaultPreferences,
  createThemeStore,
  mergePreferences,
  resolveThemeMode,
  resolveThemeTokens,
} from '../src/theme'

describe('theme runtime', () => {
  it('会创建默认主题状态并生成 CSS 变量 token', () => {
    const store = createThemeStore()
    const tokens = resolveThemeTokens(store.state)

    expect(store.state).toEqual({
      colorPrimary: '#1677ff',
      compact: false,
      mode: 'light',
    })
    expect(tokens['--luma-color-primary']).toBe('#1677ff')
    expect(tokens['--luma-density-padding']).toBe('16px')
  })

  it('会更新主题色、明暗模式和紧凑模式', () => {
    const store = createThemeStore()

    store.setColorPrimary('#22c55e')
    store.setMode('dark')
    store.setCompact(true)

    expect(store.state).toEqual({
      colorPrimary: '#22c55e',
      compact: true,
      mode: 'dark',
    })
  })

  it('会把主题状态应用到 DOM 元素', () => {
    const element = document.createElement('div')
    const store = createThemeStore({
      colorPrimary: '#22c55e',
      compact: true,
      mode: 'dark',
    })

    applyThemeToElement(element, store.state)

    expect(element.dataset.lumaTheme).toBe('dark')
    expect(element.dataset.lumaCompact).toBe('true')
    expect(element.style.getPropertyValue('--luma-color-primary')).toBe('#22c55e')
    expect(element.style.getPropertyValue('--luma-density-padding')).toBe('12px')
  })

  it('会创建并合并 Luma 偏好配置', () => {
    const preferences = createDefaultPreferences({
      theme: {
        colorPrimary: '#22c55e',
        mode: 'dark',
      },
      transition: {
        loading: false,
      },
    })
    const merged = mergePreferences(preferences, {
      sidebar: {
        collapsed: true,
      },
      tabbar: {
        cache: false,
      },
    })

    expect(preferences).toMatchObject({
      app: {
        layout: 'sidebar-nav',
      },
      theme: {
        colorPrimary: '#22c55e',
        mode: 'dark',
        radiusScale: 0.5,
      },
      transition: {
        enable: true,
        loading: false,
        name: 'fade-side',
        progress: true,
      },
    })
    expect(merged.sidebar.collapsed).toBe(true)
    expect(merged.tabbar.cache).toBe(false)
    expect(merged.theme.colorPrimary).toBe('#22c55e')
  })

  it('会解析 system 主题并把偏好应用到 DOM', () => {
    const element = document.createElement('html')
    const matchMedia = () => ({ matches: true }) as MediaQueryList
    const preferences = createDefaultPreferences({
      theme: {
        colorPrimary: '#16a34a',
        mode: 'system',
        radiusScale: 0.75,
      },
    })

    const resolvedMode = applyThemePreferences(preferences, {
      document: { documentElement: element } as Document,
      matchMedia,
    })

    expect(resolveThemeMode('system', { matchMedia })).toBe('dark')
    expect(resolvedMode).toBe('dark')
    expect(element.classList.contains('dark')).toBe(true)
    expect(element.dataset.lumaTheme).toBe('dark')
    expect(element.style.getPropertyValue('--luma-color-primary')).toBe('#16a34a')
    expect(element.style.getPropertyValue('--el-color-primary')).toBe('#16a34a')
    expect(element.style.getPropertyValue('--luma-radius-scale')).toBe('0.75')
    expect(element.style.getPropertyValue('--luma-sidebar-width')).toBe('220px')
  })
})
