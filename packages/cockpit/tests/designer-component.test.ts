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

describe('LumaCockpitDesigner', () => {
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
