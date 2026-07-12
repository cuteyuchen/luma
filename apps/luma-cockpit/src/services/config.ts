import type { CockpitConfig } from '@luma/cockpit'
import { prepareCockpitConfig } from '@luma/cockpit'

/***********************独立应用配置与保存实现*********************/
// 独立应用自行决定从静态默认或本地存储加载，并提供自己的保存实现。

const STORAGE_KEY = 'luma-standalone-cockpit-config'

/** 中性默认配置，不含任何行业术语 */
const defaultConfig: CockpitConfig = {
  schemaVersion: 1,
  id: 'standalone-cockpit',
  title: '独立驾驶舱',
  activeCategoryId: 'category-main',
  categories: [
    {
      id: 'category-main',
      label: '主分类',
      visible: true,
      activePageId: 'page-main',
      pages: [
        {
          id: 'page-main',
          title: '主页面',
          center: { id: 'center-main', type: 'standalone-center' },
          left: {
            columns: [
              {
                id: 'col-left',
                width: 1,
                containers: [
                  {
                    id: 'ct-left',
                    height: 1,
                    mode: 'single',
                    widgets: [{ id: 'w-left', type: 'standalone-widget', title: '模块', visible: true }],
                  },
                ],
              },
            ],
          },
          right: { columns: [] },
        },
      ],
    },
  ],
}

export function loadStandaloneConfig(): CockpitConfig {
  if (typeof localStorage !== 'undefined') {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        return prepareCockpitConfig(JSON.parse(raw))
      }
      catch {
        // 忽略损坏的本地配置，回退到默认
      }
    }
  }
  return prepareCockpitConfig(defaultConfig)
}

export function saveStandaloneConfig(config: CockpitConfig): CockpitConfig {
  const normalized = prepareCockpitConfig(config)
  if (typeof localStorage !== 'undefined')
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
  return normalized
}
