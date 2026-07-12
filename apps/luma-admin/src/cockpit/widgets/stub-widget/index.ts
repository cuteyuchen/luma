import type { CockpitWidgetDefinition } from '@luma/cockpit'

export const widgetDefinition: CockpitWidgetDefinition = {
  type: 'stub-widget',
  label: '示例模块',
  description: '演示消息联动的中性业务模块',
  group: 'application-group',
  component: () => import('./Widget.vue'),
}
