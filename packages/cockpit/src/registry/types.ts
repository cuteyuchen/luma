import type { Component } from 'vue'

/***********************注册表定义类型*********************/

/** 组件既可同步传入，也可为异步导入函数以支持代码分割 */
export type CockpitComponentLoader = Component | (() => Promise<unknown>)

export interface CockpitCenterDefinition {
  type: string
  label: string
  description?: string
  /** 仅用于应用自定义的组件库分组过滤，包不预设固定分组 */
  group?: string
  icon?: string
  thumbnail?: string
  component: CockpitComponentLoader
}

export interface CockpitWidgetDefinition {
  type: string
  label: string
  description?: string
  group?: string
  icon?: string
  thumbnail?: string
  component: CockpitComponentLoader
}

export interface CockpitRegistry {
  registerCenter: (definition: CockpitCenterDefinition) => void
  registerCenters: (definitions: CockpitCenterDefinition[]) => void
  unregisterCenter: (type: string) => void
  resolveCenter: (type: string) => CockpitCenterDefinition | undefined
  listCenters: () => readonly CockpitCenterDefinition[]

  registerWidget: (definition: CockpitWidgetDefinition) => void
  registerWidgets: (definitions: CockpitWidgetDefinition[]) => void
  unregisterWidget: (type: string) => void
  resolveWidget: (type: string) => CockpitWidgetDefinition | undefined
  listWidgets: () => readonly CockpitWidgetDefinition[]
}
