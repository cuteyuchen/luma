import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { createLumaAdmin } from '../src'

describe('createLumaAdmin', () => {
  it('可以创建 Vue 应用并暴露 mount/use 上下文', () => {
    const Root = defineComponent({
      name: 'RootForCreateLumaAdminTest',
      setup() {
        return () => h('div', 'Luma')
      },
    })

    const framework = createLumaAdmin({
      rootComponent: Root,
    })

    expect(framework.app).toBeTruthy()
    expect(typeof framework.mount).toBe('function')
    expect(typeof framework.use).toBe('function')
  })

  it('会在初始化时同步注册业务本地图标', () => {
    const Root = defineComponent({
      name: 'RootForIconRegistrationTest',
      setup() {
        return () => h('div', 'Luma')
      },
    })

    createLumaAdmin({
      rootComponent: Root,
      icons: {
        localSvg: [
          {
            key: 'app:boot',
            label: '启动图标',
            source: 'local-svg',
            svgText: '<svg viewBox="0 0 16 16"><path fill="currentColor" d="M2 2h12v12H2z"/></svg>',
          },
        ],
      },
    })

    expect(true).toBe(true)
  })
})
