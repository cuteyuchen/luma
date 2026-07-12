import type { CockpitCenterDefinition } from '@luma/cockpit'

export const centerDefinition: CockpitCenterDefinition = {
  type: 'stub-center',
  label: '示例中央视图',
  description: '演示消息联动的中性中央组件',
  group: 'application-centers',
  component: () => import('./Center.vue'),
}
