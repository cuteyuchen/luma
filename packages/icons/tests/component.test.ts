import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { LumaIcon, registerIcons } from '../src'

describe('lumaIcon', () => {
  it('可以渲染已注册的 SVG 图标', () => {
    registerIcons([
      {
        key: 'app:component',
        label: '组件图标',
        source: 'local-svg',
        svgText: '<svg viewBox="0 0 16 16"><path fill="currentColor" d="M1 1h14v14H1z"/></svg>',
      },
    ])

    const wrapper = mount(LumaIcon, {
      props: {
        name: 'app:component',
        color: '#1677ff',
        size: 20,
      },
    })

    expect(wrapper.classes()).toContain('luma-icon')
    expect(wrapper.html()).toContain('#1677ff')
    expect(wrapper.attributes('style')).toContain('--luma-icon-size: 20px')
  })
})
