import type { Component } from 'vue'

/***********************模块注册表*********************/
// 中央内容由消费应用的 runtime slot 提供，不属于配置注册表。

export type CockpitComponentLoader = Component | (() => Promise<unknown>)

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
  registerWidget: (definition: CockpitWidgetDefinition) => void
  registerWidgets: (definitions: CockpitWidgetDefinition[]) => void
  unregisterWidget: (type: string) => void
  resolveWidget: (type: string) => CockpitWidgetDefinition | undefined
  listWidgets: () => readonly CockpitWidgetDefinition[]
}
