import type { IconDefinition } from '@lumal/icons'
import type { App, Component, Plugin } from 'vue'
import type { DictionaryPluginOptions } from '../dictionary'
import type { PermissionStore } from '../permission'

export type LumalAdminPreset = 'admin-default' | 'minimal'

export type LumalRouterPlugin = Plugin & {
  isReady?: () => Promise<void>
}

export interface LumalElementPlusOptions {
  options?: Record<string, unknown>
  plugin: Plugin
}

export type LumalElementPlusInput = Plugin | LumalElementPlusOptions

export type LumalComponentSelection = boolean | string[] | Record<string, Component>

/***********************应用上下文类型*********************/
export interface LumalAdminContext {
  app: App
  permissionStore?: PermissionStore
  pinia?: Plugin
  router?: LumalRouterPlugin
}

export interface CreateLumalAdminOptions {
  components?: LumalComponentSelection
  dictionary?: false | DictionaryPluginOptions
  elementPlus?: LumalElementPlusInput
  icons?: {
    localSvg?: IconDefinition[]
  }
  permissionStore?: PermissionStore
  pinia?: Plugin
  preset?: LumalAdminPreset
  router?: LumalRouterPlugin
  rootComponent: Component
  rootProps?: Record<string, unknown>
  setup?: (context: LumalAdminContext) => void | Promise<void>
}

export interface LumalAdminInstance extends LumalAdminContext {
  mount: (container: Element | string) => Promise<ReturnType<App['mount']>>
  use: (plugin: Plugin, ...options: unknown[]) => LumalAdminInstance
}
