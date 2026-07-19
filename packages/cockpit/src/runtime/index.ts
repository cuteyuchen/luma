import type { App } from 'vue'
import LumalCockpitComp from './LumalCockpit.vue'
import LumalCockpitCardComp from './LumalCockpitCard.vue'

/***********************组件安装包装*********************/
type WithInstall<T> = T & { install: (app: App) => void }

function withInstall<T extends Record<string, unknown>>(component: T, name: string): WithInstall<T> {
  const installable = component as WithInstall<T>

  installable.install = function install(app: App): void {
    app.component(name, component as never)
  }

  return installable
}

/***********************导出*********************/
export const LumalCockpit = withInstall(
  LumalCockpitComp as unknown as Record<string, unknown>,
  'LumalCockpit',
) as typeof LumalCockpitComp & { install: (app: App) => void }

export const LumalCockpitCard = withInstall(
  LumalCockpitCardComp as unknown as Record<string, unknown>,
  'LumalCockpitCard',
) as typeof LumalCockpitCardComp & { install: (app: App) => void }

export type { CockpitCardComponent, CockpitCardProps, CockpitCardTab } from './card'
export { cockpitRuntimeEnvKey, useCockpitRuntimeEnv } from './context'
export type { CockpitRuntimeEnv } from './context'
export { default as LumalCockpitCanvas } from './LumalCockpitCanvas.vue'
export { default as LumalCockpitContainer } from './LumalCockpitContainer.vue'
export { default as LumalCockpitRegion } from './LumalCockpitRegion.vue'
export { default as LumalCockpitWidgetHost } from './LumalCockpitWidgetHost.vue'
export { resolveCockpitComponent } from './resolveComponent'
