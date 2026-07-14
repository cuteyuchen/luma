import type { CockpitWidgetDefinition } from '@luma/cockpit'
import previewImage from '../../assets/fuyang-cockpit/standalone-widget.png'

export const widgetDefinition: CockpitWidgetDefinition = {
  type: 'standalone-widget',
  label: '独立业务模块',
  group: 'standalone-group',
  thumbnail: previewImage,
  component: () => import('./Widget.vue'),
}
