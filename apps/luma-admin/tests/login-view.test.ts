import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { createMemoryHistory } from 'vue-router'
import { elementPlusStubs } from '../../../packages/core/tests/helpers/element-plus-stubs'
import { createAdminRouter } from '../src/router'
import { currentUser, logout } from '../src/services/session'
import LoginView from '../src/views/login/LoginView.vue'

describe('login view', () => {
  afterEach(async () => {
    await logout()
  })

  it('会使用账号预设登录并按 redirect 回跳', async () => {
    const router = createAdminRouter(createMemoryHistory())

    await router.push('/login?redirect=/project')
    await router.isReady()

    const wrapper = mount(LoginView, {
      global: {
        plugins: [router],
        stubs: elementPlusStubs,
      },
    })

    expect(wrapper.text()).toContain('Luma Admin')
    expect(wrapper.find('[data-testid="login-username"] input').element).toHaveProperty('value', 'admin')

    await wrapper.find('[data-testid="login-account"]').setValue('operator')
    expect(wrapper.find('[data-testid="login-username"] input').element).toHaveProperty('value', 'operator')

    await wrapper.find('[data-testid="login-form"]').trigger('submit')
    await flushPromises()

    expect(currentUser.value?.username).toBe('operator')
    expect(router.currentRoute.value.path).toBe('/project')
  })
})
