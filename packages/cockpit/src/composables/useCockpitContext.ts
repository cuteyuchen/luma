import type { InjectionKey } from 'vue'
import type { CockpitBaseContext } from '../types'
import { inject, provide } from 'vue'

/***********************渲染上下文 provide/inject*********************/

export const cockpitContextKey: InjectionKey<CockpitBaseContext> = Symbol('lumal-cockpit-context')

/**
 * 由中央组件 Host 与模块 Host 为每个实例提供独立上下文。
 * 相同 type 的多个实例拥有不同的 instanceId，因此各自 provide 一份。
 */
export function provideCockpitContext(context: CockpitBaseContext): void {
  provide(cockpitContextKey, context)
}

/**
 * 在中央组件或业务模块内获取当前实例的渲染上下文。
 * 默认在缺失时抛出可定位错误；传入 optional 时返回 null。
 */
export function useCockpitContext(optional: true): CockpitBaseContext | null
export function useCockpitContext(optional?: false): CockpitBaseContext
export function useCockpitContext(optional = false): CockpitBaseContext | null {
  const context = inject(cockpitContextKey, null)
  if (!context && !optional)
    throw new Error('[cockpit] 未找到驾驶舱渲染上下文，请确认组件在 LumalCockpit 内渲染。')
  return context
}
