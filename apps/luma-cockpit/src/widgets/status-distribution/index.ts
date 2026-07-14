import type { CockpitWidgetDefinition } from '@luma/cockpit'
import previewImage from '../../assets/fuyang-cockpit/status-distribution.png'
import Widget from './Widget.vue'

export const widgetDefinition: CockpitWidgetDefinition = {
  type: 'status-distribution',
  label: '状态分布',
  group: '示例模块',
  thumbnail: previewImage,
  component: Widget,
}
