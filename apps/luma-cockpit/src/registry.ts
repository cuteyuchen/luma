import type {
  CockpitCenterDefinition,
  CockpitWidgetDefinition,
} from '@luma/cockpit'
import { createCockpitRegistry } from '@luma/cockpit'

/***********************独立应用自建注册表*********************/

const registry = createCockpitRegistry()

const centerModules = import.meta.glob<{
  centerDefinition: CockpitCenterDefinition
}>('./centers/*/index.ts', { eager: true })

const widgetModules = import.meta.glob<{
  widgetDefinition: CockpitWidgetDefinition
}>('./widgets/*/index.ts', { eager: true })

registry.registerCenters(
  Object.values(centerModules).map(module => module.centerDefinition),
)

registry.registerWidgets(
  Object.values(widgetModules).map(module => module.widgetDefinition),
)

export { registry as standaloneCockpitRegistry }
