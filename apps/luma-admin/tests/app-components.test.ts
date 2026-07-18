import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import AppHeaderActions from '../src/components/app/AppHeaderActions.vue'
import AppSettingsDrawer from '../src/components/app/AppSettingsDrawer.vue'
import { createAdminPreferences } from '../src/services/preferences'
import { elementPlusStubs } from './helpers/element-plus-stubs'

const IconStub = defineComponent({
  name: 'LumaIcon',
  props: {
    name: String,
  },
  template: '<i class="luma-icon-stub" :data-icon="name" />',
})

const DrawerStub = defineComponent({
  name: 'ElDrawer',
  props: {
    modelValue: Boolean,
    size: String,
    title: String,
  },
  emits: ['update:modelValue'],
  template: '<section v-if="modelValue" class="el-drawer" :data-size="size" :data-title="title"><slot name="header" /><slot /></section>',
})

const ThemeSettingsPanelStub = defineComponent({
  name: 'LumaThemeSettingsPanel',
  props: {
    preferences: Object,
  },
  emits: ['change', 'update:preferences'],
  template: `
    <button
      class="theme-panel-stub"
      type="button"
      @click="$emit('change', preferences); $emit('update:preferences', preferences)"
    >
      主题设置
    </button>
  `,
})

describe('app header actions', () => {
  it('会展示用户入口并抛出主题切换、设置打开和登出事件', async () => {
    const wrapper = mount(AppHeaderActions, {
      global: {
        stubs: {
          ...elementPlusStubs,
          LumaIcon: IconStub,
        },
      },
      props: {
        cockpitUrl: 'http://localhost:5180/',
        resolvedThemeMode: 'dark',
        userName: '管理员',
      },
    })

    expect(wrapper.find('[data-action="toggle-theme"]').exists()).toBe(true)
    expect(wrapper.find('[data-action="open-cockpit"]').attributes('href')).toBe('http://localhost:5180/')
    expect(wrapper.find('[data-action="open-cockpit"]').attributes('target')).toBe('_blank')
    expect(wrapper.find('[data-action="open-settings"]').exists()).toBe(true)
    expect(wrapper.find('[data-action="open-settings"]').attributes('aria-label')).toBe('偏好设置')
    expect(wrapper.find('[data-action="open-profile"]').exists()).toBe(true)
    expect(wrapper.find('[data-action="logout"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('管理员')

    await wrapper.find('[data-action="toggle-theme"]').trigger('click')
    await wrapper.find('[data-action="open-settings"]').trigger('click')
    await wrapper.find('[data-action="open-profile"]').trigger('click')
    await wrapper.find('[data-action="logout"]').trigger('click')

    expect(wrapper.emitted('toggleTheme')).toHaveLength(1)
    expect(wrapper.emitted('openSettings')).toHaveLength(1)
    expect(wrapper.emitted('openProfile')).toHaveLength(1)
    expect(wrapper.emitted('logout')).toHaveLength(1)
  })
})

describe('app settings drawer', () => {
  it('会包裹主题设置面板并透传偏好变更', async () => {
    const preferences = createAdminPreferences()
    const wrapper = mount(AppSettingsDrawer, {
      global: {
        stubs: {
          ElDrawer: DrawerStub,
          LumaThemeSettingsPanel: ThemeSettingsPanelStub,
        },
      },
      props: {
        preferences,
        visible: true,
      },
    })

    expect(wrapper.find('.el-drawer').attributes('data-title')).toBe('偏好设置')
    expect(wrapper.find('.el-drawer').attributes('data-size')).toBe('384px')
    expect(wrapper.text()).toContain('自定义偏好设置 & 实时预览')

    await wrapper.find('.theme-panel-stub').trigger('click')

    expect(wrapper.emitted('change')?.[0]).toEqual([preferences])
    expect(wrapper.emitted('update:preferences')?.[0]).toEqual([preferences])
  })
})
