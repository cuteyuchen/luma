import { registerAuthorityDirectives } from '@luma/core/directives'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import AppHeaderActions from '../src/components/app/AppHeaderActions.vue'
import { permissionStore } from '../src/services/permission'
import { login, logout } from '../src/services/session'
import { elementPlusStubs } from './helpers/element-plus-stubs'

const IconStub = defineComponent({ name: 'LumaIcon', template: '<i class="luma-icon-stub" />' })
const cockpitUrl = 'http://localhost:5180/'

describe('cockpit 外链集成', () => {
  afterEach(async () => {
    await logout()
  })

  it('有查看权限用户看到独立驾驶舱外链', async () => {
    await login('admin')
    const wrapper = mountHeaderActions()
    await flushPromises()

    const link = wrapper.find('[data-action="open-cockpit"]')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe(cockpitUrl)
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
  })

  it('无查看权限用户看不到驾驶舱入口', async () => {
    await login('guest')
    const wrapper = mountHeaderActions()
    await flushPromises()

    const link = wrapper.find('[data-action="open-cockpit"]')
    const hidden = !link.exists() || (link.element as HTMLElement).style.display === 'none'
    expect(hidden).toBe(true)
  })
})

function mountHeaderActions() {
  return mount(AppHeaderActions, {
    props: {
      cockpitUrl,
      resolvedThemeMode: 'light' as const,
    },
    global: {
      stubs: { ...elementPlusStubs, LumaIcon: IconStub },
      directives: { authority: makeAuthorityDirective() },
    },
  })
}

/** 从 core 提取 authority 指令，供组件测试注册 */
function makeAuthorityDirective() {
  const captured: Record<string, unknown> = {}
  const fakeApp = {
    directive(name: string, def: unknown) {
      captured[name] = def
      return fakeApp
    },
  }
  registerAuthorityDirectives(fakeApp as never, permissionStore)
  return captured.authority as never
}
