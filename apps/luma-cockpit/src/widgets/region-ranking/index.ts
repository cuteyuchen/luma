import type { CockpitWidgetDefinition } from '@luma/cockpit'
import previewImage from '../../assets/fuyang-cockpit/region-ranking.png'
import Widget from './Widget.vue'

export const widgetDefinition: CockpitWidgetDefinition = {
  type: 'region-ranking',
  label: '区域排名',
  group: '示例模块',
  thumbnail: previewImage,
  component: Widget,
}
