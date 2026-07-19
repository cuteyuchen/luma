import type { CockpitWidgetDefinition } from '@lumal/cockpit'
import Widget from './Widget.vue'

export const widgetDefinition: CockpitWidgetDefinition = {
  type: 'status-distribution',
  label: '区域状态分布',
  group: '示例模块',
  component: Widget,
}
