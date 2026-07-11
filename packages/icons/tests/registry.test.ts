import { describe, expect, it } from 'vitest'
import {
  createComponentIconDefinitions,
  createIconifyIconDefinitions,
  getRegisteredIconDefinitions,
  getRegisteredIconGroups,
  registerIconGroups,
  registerIcons,
  resolveIconDefinition,
} from '../src'

describe('@luma/icons registry', () => {
  it('会预注册框架通用图标', () => {
    expect(resolveIconDefinition('luma:sun')).toMatchObject({ label: '浅色模式' })
    expect(resolveIconDefinition('luma:moon')).toMatchObject({ label: '深色模式' })
    expect(resolveIconDefinition('luma:monitor')).toMatchObject({ label: '跟随系统' })
    expect(resolveIconDefinition('luma:settings')).toBeTruthy()
  })

  it('注册图标后可以按 key 同步解析', () => {
    registerIcons([
      {
        key: 'app:dashboard',
        label: '控制台',
        source: 'local-svg',
        svgText: '<svg viewBox="0 0 16 16"><path fill="currentColor" d="M2 2h5v5H2z"/></svg>',
      },
    ])

    expect(resolveIconDefinition('app:dashboard')).toMatchObject({
      key: 'app:dashboard',
      label: '控制台',
      source: 'local-svg',
    })
    expect(getRegisteredIconDefinitions().some(icon => icon.key === 'app:dashboard')).toBe(true)
  })

  it('注册图标分组后可以被图标选择器读取', () => {
    registerIconGroups([
      {
        key: 'app',
        label: '应用',
        order: 20,
      },
      {
        key: 'base',
        label: '基础',
        order: 10,
      },
    ])

    expect(getRegisteredIconGroups().slice(0, 2).map(group => group.key)).toEqual(['base', 'app'])
    expect(resolveIconDefinition('missing:key')).toBeUndefined()
  })

  it('可以批量创建组件和 Iconify 图标定义', () => {
    const component = { name: 'MockIcon' }

    expect(createComponentIconDefinitions('element-plus', { Edit: component })).toEqual([
      expect.objectContaining({ component, key: 'element-plus:Edit', source: 'component' }),
    ])
    expect(createIconifyIconDefinitions('mdi', ['home'])).toEqual([
      expect.objectContaining({ icon: 'home', key: 'mdi:home', source: 'iconify' }),
    ])
  })
})
