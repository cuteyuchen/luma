import type {
  CockpitCenterDefinition,
  CockpitRegistry,
  CockpitWidgetDefinition,
} from './types'

/***********************注册表实现*********************/

function assertType(type: unknown, kind: string): asserts type is string {
  if (typeof type !== 'string' || type.trim() === '')
    throw new Error(`[cockpit] ${kind} 定义缺少有效的 type。`)
}

/**
 * 创建一个中央组件与业务模块的注册器。
 *
 * - 中央组件与业务模块使用彼此独立的命名空间。
 * - 同一命名空间内重复 type 会抛出可定位错误。
 * - list 方法返回稳定插入顺序，且不暴露内部可变数组。
 */
export function createCockpitRegistry(): CockpitRegistry {
  const centers = new Map<string, CockpitCenterDefinition>()
  const widgets = new Map<string, CockpitWidgetDefinition>()

  function registerCenter(definition: CockpitCenterDefinition): void {
    assertType(definition?.type, '中央组件')
    if (centers.has(definition.type))
      throw new Error(`[cockpit] 中央组件 type 重复注册：${definition.type}`)
    centers.set(definition.type, definition)
  }

  function registerWidget(definition: CockpitWidgetDefinition): void {
    assertType(definition?.type, '业务模块')
    if (widgets.has(definition.type))
      throw new Error(`[cockpit] 业务模块 type 重复注册：${definition.type}`)
    widgets.set(definition.type, definition)
  }

  return {
    registerCenter,
    registerCenters(definitions) {
      definitions.forEach(registerCenter)
    },
    unregisterCenter(type) {
      centers.delete(type)
    },
    resolveCenter(type) {
      return centers.get(type)
    },
    listCenters() {
      return Object.freeze([...centers.values()])
    },

    registerWidget,
    registerWidgets(definitions) {
      definitions.forEach(registerWidget)
    },
    unregisterWidget(type) {
      widgets.delete(type)
    },
    resolveWidget(type) {
      return widgets.get(type)
    },
    listWidgets() {
      return Object.freeze([...widgets.values()])
    },
  }
}
