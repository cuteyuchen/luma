import type { CockpitWidgetDefinition } from '@luma/cockpit'
import { createCockpitRegistry } from '@luma/cockpit'

/***********************独立应用自建注册表*********************/

const registry = createCockpitRegistry()

const widgetModules = import.meta.glob<{
  widgetDefinition: CockpitWidgetDefinition
}>('./widgets/*/index.ts', { eager: true })

registry.registerWidgets(
  Object.values(widgetModules).map(module => module.widgetDefinition),
)

export { registry as standaloneCockpitRegistry }
