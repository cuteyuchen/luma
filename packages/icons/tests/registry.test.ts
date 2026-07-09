import { describe, expect, it } from 'vitest'
import {
  getRegisteredIconDefinitions,
  registerIconGroups,
  registerIcons,
  resolveIconDefinition,
} from '../src'

describe('@luma/icons registry', () => {
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
      },
    ])

    expect(resolveIconDefinition('missing:key')).toBeUndefined()
  })
})
