import { describe, expect, it } from 'vitest'
import {
  adminPreferenceDefaults,
  applyAdminPreferences,
  createAdminPreferences,
  resolveAdminThemeEnvironment,
} from '../src/services/preferences'

describe('luma admin preferences', () => {
  it('会创建后台基座默认偏好', () => {
    const preferences = createAdminPreferences()

    expect(preferences).toMatchObject({
      app: {
        layout: 'mixed-nav',
      },
      sidebar: {
        collapsed: false,
        enable: true,
        width: 248,
      },
      tabbar: {
        cache: true,
        enable: true,
        maxCount: 8,
      },
      theme: {
        colorPrimary: '#1677ff',
        mode: 'system',
      },
      transition: {
        enable: true,
        loading: true,
        name: 'fade-side',
        progress: true,
      },
    })
    expect(adminPreferenceDefaults.app?.layout).toBe('mixed-nav')
  })

  it('会在无 DOM 环境下安全返回空主题运行时环境', () => {
    expect(resolveAdminThemeEnvironment(null, null)).toEqual({})
  })

  it('会容忍没有 matchMedia 的 DOM 环境', () => {
    const environment = resolveAdminThemeEnvironment(document, null)

    expect(environment.document).toBe(document)
    expect(environment.matchMedia).toBeUndefined()
  })

  it('会在默认 jsdom 环境中安全应用主题偏好', () => {
    expect(() => applyAdminPreferences(createAdminPreferences())).not.toThrow()
    expect(document.documentElement.dataset.lumaTheme).toBeTruthy()
  })
})
