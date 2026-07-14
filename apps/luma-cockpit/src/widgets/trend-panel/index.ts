import type { CockpitWidgetDefinition } from '@luma/cockpit'
import previewImage from '../../assets/fuyang-cockpit/trend-panel.png'
import Widget from './Widget.vue'

export const widgetDefinition: CockpitWidgetDefinition = {
  type: 'trend-panel',
  label: '趋势图',
  group: '示例模块',
  thumbnail: previewImage,
  component: Widget,
}
