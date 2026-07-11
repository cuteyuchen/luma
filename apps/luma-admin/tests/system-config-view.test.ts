import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { adminSettingsVisible, closeAdminSettings } from '../src/services/settings'
import ConfigView from '../src/views/system/ConfigView.vue'

const PageStub = defineComponent({
  name: 'LumaPage',
  setup(_, { slots }) {
    return () => h('section', { class: 'page-stub' }, [slots.actions?.(), slots.default?.()])
  },
})

describe('system config view', () => {
  afterEach(() => {
    closeAdminSettings()
  })

  it('作为统一设置说明入口打开全局抽屉', async () => {
    const wrapper = mount(ConfigView, {
      global: {
        stubs: {
          LumaInfoTable: true,
          LumaPage: PageStub,
        },
      },
    })

    expect(wrapper.text()).toContain('打开全局设置')
    await wrapper.get('[data-action="open-global-settings"]').trigger('click')
    expect(adminSettingsVisible.value).toBe(true)
  })
})
