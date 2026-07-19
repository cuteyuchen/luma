import type { CockpitWidgetDefinition } from '@lumal/cockpit'

export const widgetDefinition: CockpitWidgetDefinition = {
  type: 'standalone-widget',
  label: '独立业务模块',
  group: 'standalone-group',
  component: () => import('./Widget.vue'),
}
