import type { CockpitWidgetDefinition } from '@luma/cockpit'
import previewImage from '../../assets/fuyang-cockpit/metric-summary.png'
import Widget from './Widget.vue'

export const widgetDefinition: CockpitWidgetDefinition = {
  type: 'metric-summary',
  label: '指标摘要',
  group: '示例模块',
  thumbnail: previewImage,
  component: Widget,
}
