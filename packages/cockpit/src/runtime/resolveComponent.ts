import type { Component } from 'vue'
import type { CockpitComponentLoader } from '../registry/types'
import { defineAsyncComponent } from 'vue'

/***********************组件解析*********************/

const asyncCache = new WeakMap<object, Component>()

/**
 * 将注册定义中的 component 解析为可渲染的 Vue 组件。
 *
 * - 函数视为异步 loader，用 defineAsyncComponent 包装以支持代码分割；
 *   同一 loader 记忆化，避免每次渲染重新定义导致状态丢失。
 * - 其余（SFC / 组件对象）直接返回。
 *
 * 加载或渲染失败不在此处处理，交由 Host 的错误边界统一降级并提供重试。
 */
export function resolveCockpitComponent(loader: CockpitComponentLoader): Component {
  if (typeof loader === 'function') {
    const fn = loader as object
    const cached = asyncCache.get(fn)
    if (cached)
      return cached
    const resolved = defineAsyncComponent(loader as () => Promise<Component>)
    asyncCache.set(fn, resolved)
    return resolved
  }
  return loader
}
