import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { useCockpitAutoRefresh } from '../src/composables/useCockpitAutoRefresh'
import { createCockpitMessageBus } from '../src/messaging/createCockpitMessageBus'
import { COCKPIT_REFRESH_TOPIC } from '../src/messaging/topics'

describe('useCockpitAutoRefresh', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('关闭时不广播；开启后按间隔广播 cockpit:refresh', async () => {
    const messages = createCockpitMessageBus()
    const handler = vi.fn()
    messages.subscribe(COCKPIT_REFRESH_TOPIC, handler)

    const enabled = ref(false)
    let refreshNow!: () => void

    const Host = defineComponent({
      setup() {
        const api = useCockpitAutoRefresh({
          messages,
          sourceId: 'cockpit-1',
          intervalMs: 1000,
          enabled,
        })
        refreshNow = api.refreshNow
        return () => h('div')
      },
    })

    const wrapper = mount(Host)

    vi.advanceTimersByTime(3000)
    expect(handler).not.toHaveBeenCalled()

    enabled.value = true
    await nextTick()
    vi.advanceTimersByTime(1000)
    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler.mock.calls[0]?.[0]).toMatchObject({
      topic: COCKPIT_REFRESH_TOPIC,
      sourceId: 'cockpit-1',
      payload: { reason: 'interval' },
    })

    vi.advanceTimersByTime(2000)
    expect(handler).toHaveBeenCalledTimes(3)

    enabled.value = false
    await nextTick()
    vi.advanceTimersByTime(3000)
    expect(handler).toHaveBeenCalledTimes(3)

    refreshNow()
    expect(handler).toHaveBeenCalledTimes(4)
    expect(handler.mock.calls[3]?.[0].payload).toMatchObject({ reason: 'manual' })

    wrapper.unmount()
  })
})
