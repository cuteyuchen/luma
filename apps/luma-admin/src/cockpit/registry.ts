import type { CockpitWidgetDefinition } from '@luma/cockpit'
import { createCockpitRegistry } from '@luma/cockpit'

/***********************编译期自动注册*********************/
// 组件目录扫描发生在 App 层，@luma/cockpit 只接收扫描结果。

const registry = createCockpitRegistry()

const widgetModules = import.meta.glob<{
  widgetDefinition: CockpitWidgetDefinition
}>('./widgets/*/index.ts', { eager: true })

registry.registerWidgets(
  Object.values(widgetModules).map(module => module.widgetDefinition),
)

export { registry as adminCockpitRegistry }
