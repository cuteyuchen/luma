import type { CockpitConfig, CockpitDesignerSavePayload } from '../src/types'
import { mount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import LumaCockpitDesigner from '../src/designer/LumaCockpitDesigner.vue'
import { createCockpitRegistry } from '../src/registry/createCockpitRegistry'

const StubWidget = defineComponent({ name: 'DesignerStubWidget', setup: () => () => null })

function config(): CockpitConfig {
  return {
    schemaVersion: 3,
    id: 'designer-cockpit',
    title: '配置测试',
    activeLayoutId: 'layout-a',
    layouts: [{
      id: 'layout-a',
      title: '布局 A',
      left: {
        columns: [{ id: 'left-column', width: 320 }],
        rows: [{ id: 'left-row', height: 100, mode: 'grid', cells: [{ id: 'left-cell' }], widgets: [] }],
      },
      right: {
        columns: [{ id: 'right-column', width: 320 }],
        rows: [{ id: 'right-row', height: 100, mode: 'grid', cells: [{ id: 'right-cell' }], widgets: [] }],
      },
    }],
  }
}

describe('lumaCockpitDesigner', () => {
  it('区域、行和模块操作使用独立的局部工具层', () => {
    const registry = createCockpitRegistry()
    registry.registerWidget({ type: 'stub', label: '示例模块', component: StubWidget })
    const current = config()
    current.layouts[0].right.rows[0].cells[0].widget = { id: 'right-widget', type: 'stub', title: '右侧模块' }
    const wrapper = mount(LumaCockpitDesigner, {
      props: { config: current, registry },
      global: { plugins: [ElementPlus] },
    })

    expect(wrapper.findAll('[data-role="region-tools"]')).toHaveLength(2)
    expect(wrapper.findAll('[data-role="row-tools"]')).toHaveLength(2)

    const rightRegion = wrapper.get('[data-side="right"]')
    expect(rightRegion.get('[data-role="region-tools-trigger"]').attributes('aria-label')).toBe('右侧区域设置')
    expect(rightRegion.get('[data-role="region-tools-panel"] .luma-cockpit-designer__region-head').exists()).toBe(true)
    expect(rightRegion.get('[data-role="row-tools"] [data-role="row-tools-panel"]').exists()).toBe(true)
    expect(rightRegion.get('[data-role="remove-widget"]').attributes('aria-label')).toBe('移除模块 右侧模块')
  })

  it('保存时同时输出完整配置和当前布局', async () => {
    const registry = createCockpitRegistry()
    registry.registerWidget({ type: 'stub', label: '示例模块', component: StubWidget })
    const wrapper = mount(LumaCockpitDesigner, {
      props: { config: config(), registry },
      global: { plugins: [ElementPlus] },
    })

    await wrapper.get('.luma-cockpit-designer__save').trigger('click')

    const payload = wrapper.emitted('save')?.[0]?.[0] as CockpitDesignerSavePayload
    expect(payload.config.schemaVersion).toBe(3)
    expect(payload.layout.id).toBe('layout-a')
    expect(payload.layout).toBe(payload.config.layouts[0])
  })
})
