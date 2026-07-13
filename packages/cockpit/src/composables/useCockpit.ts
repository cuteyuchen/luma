import type { ComputedRef, Ref } from 'vue'
import type { CockpitConfig, CockpitLayoutConfig } from '../types'
import { computed } from 'vue'

/***********************驾驶舱运行时编排*********************/

export interface UseCockpitOptions {
  config: () => CockpitConfig
  /** 受控的当前布局 id，由消费应用自行决定导航承载。 */
  activeLayoutId: Ref<string | undefined>
}

export interface UseCockpitReturn {
  activeLayout: ComputedRef<CockpitLayoutConfig | undefined>
  selectLayout: (id: string) => void
}

export function useCockpit(options: UseCockpitOptions): UseCockpitReturn {
  const activeLayout = computed<CockpitLayoutConfig | undefined>(() => {
    const layouts = options.config().layouts
    if (!layouts.length)
      return undefined
    const requested = options.activeLayoutId.value ?? options.config().activeLayoutId
    return layouts.find(layout => layout.id === requested) ?? layouts[0]
  })

  function selectLayout(id: string): void {
    options.activeLayoutId.value = id
  }

  return { activeLayout, selectLayout }
}
