import { COCKPIT_REFRESH_TOPIC, useCockpitContext } from '@lumal/cockpit'
import { onBeforeUnmount, ref } from 'vue'

/***********************演示：订阅全局刷新并模拟重新拉数*********************/

/**
 * 订阅 cockpit:refresh；返回 loading 与刷新代数，供模块重新渲染/请求。
 */
export function useDemoRefresh(reload?: () => void | Promise<void>) {
  const context = useCockpitContext()
  const loading = ref(false)
  const refreshCount = ref(0)

  const unsubscribe = context.messages.subscribe(COCKPIT_REFRESH_TOPIC, async () => {
    loading.value = true
    refreshCount.value += 1
    try {
      await reload?.()
      // 演示数据无真实接口时保留短延迟，便于观察刷新态
      if (!reload)
        await new Promise(resolve => window.setTimeout(resolve, 280))
    }
    finally {
      loading.value = false
    }
  }, { targetId: context.instanceId })

  onBeforeUnmount(unsubscribe)

  return { loading, refreshCount }
}
