import type { IconDefinition } from '@luma/icons'
import type { App, Component } from 'vue'

/***********************应用上下文类型*********************/
export interface LumaAdminContext {
  app: App
}

export interface CreateLumaAdminOptions {
  rootComponent: Component
  rootProps?: Record<string, unknown>
  icons?: {
    localSvg?: IconDefinition[]
  }
  setup?: (context: LumaAdminContext) => void | Promise<void>
}

export interface LumaAdminInstance extends LumaAdminContext {
  use: App['use']
  mount: App['mount']
}
