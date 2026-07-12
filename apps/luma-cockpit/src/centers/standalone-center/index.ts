import type { CockpitCenterDefinition } from '@luma/cockpit'

export const centerDefinition: CockpitCenterDefinition = {
  type: 'standalone-center',
  label: '独立中央视图',
  group: 'standalone-centers',
  component: () => import('./Center.vue'),
}
