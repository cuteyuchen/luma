import type { CockpitWidgetDefinition } from '@luma/cockpit'
import previewImage from '../../assets/fuyang-cockpit/event-list.png'
import Widget from './Widget.vue'

export const widgetDefinition: CockpitWidgetDefinition = {
  type: 'event-list',
  label: '事件列表',
  group: '示例模块',
  thumbnail: previewImage,
  component: Widget,
}
