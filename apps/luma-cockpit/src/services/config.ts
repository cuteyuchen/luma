import type { CockpitConfig } from '@luma/cockpit'
import { prepareCockpitConfig } from '@luma/cockpit'

/***********************独立应用配置与保存实现*********************/
// 独立应用自行决定从静态默认或本地存储加载，并提供自己的保存实现。

const STORAGE_KEY = 'luma-cockpit:config'

/** 中性默认配置，不含任何行业术语 */
const defaultConfig: CockpitConfig = {
  schemaVersion: 2,
  id: 'standalone-cockpit',
  title: 'Luma Cockpit',
  activeCategoryId: 'category-main',
  categories: [
    {
      id: 'category-main',
      label: '概览',
      visible: true,
      activePageId: 'page-overview',
      pages: [
        {
          id: 'page-overview',
          title: '实时概览',
          center: { id: 'center-main', type: 'standalone-center' },
          left: {
            width: 420,
            columns: [
              {
                id: 'col-left',
                width: 1,
                containers: [
                  {
                    id: 'ct-left-summary',
                    height: 0.9,
                    mode: 'single',
                    widgets: [{ id: 'w-metric-summary-a', type: 'metric-summary', title: '指标总览', visible: true }],
                  },
                  {
                    id: 'ct-left-trend-tabs',
                    height: 1.1,
                    mode: 'tabs',
                    activeWidgetId: 'w-trend-main',
                    widgets: [
                      { id: 'w-trend-main', type: 'trend-panel', title: '趋势', visible: true },
                      { id: 'w-status-tabs', type: 'status-distribution', title: '状态', visible: true },
                    ],
                  },
                ],
              },
            ],
          },
          right: {
            width: 420,
            columns: [
              {
                id: 'col-right',
                width: 1,
                containers: [
                  {
                    id: 'ct-right-events',
                    height: 1,
                    mode: 'single',
                    widgets: [{ id: 'w-event-list', type: 'event-list', title: '事件列表', visible: true }],
                  },
                  {
                    id: 'ct-right-combined',
                    height: 1,
                    mode: 'combined',
                    direction: 'vertical',
                    widgets: [
                      { id: 'w-region-ranking', type: 'region-ranking', title: '区域排名', visible: true },
                      { id: 'w-metric-summary-b', type: 'metric-summary', title: '实例对照', visible: true },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          id: 'page-analysis',
          title: '分析视图',
          center: { id: 'center-analysis', type: 'standalone-center' },
          left: {
            width: 420,
            columns: [
              {
                id: 'col-analysis-left',
                width: 1,
                containers: [
                  {
                    id: 'ct-analysis-left',
                    height: 1,
                    mode: 'combined',
                    direction: 'vertical',
                    widgets: [
                      { id: 'w-trend-analysis', type: 'trend-panel', title: '趋势对比', visible: true },
                      { id: 'w-status-analysis', type: 'status-distribution', title: '状态分布', visible: true },
                    ],
                  },
                ],
              },
            ],
          },
          right: {
            width: 420,
            columns: [
              {
                id: 'col-analysis-right',
                width: 1,
                containers: [
                  {
                    id: 'ct-analysis-right',
                    height: 1,
                    mode: 'tabs',
                    activeWidgetId: 'w-region-ranking-analysis',
                    widgets: [
                      { id: 'w-region-ranking-analysis', type: 'region-ranking', title: '区域排名', visible: true },
                      { id: 'w-event-list-analysis', type: 'event-list', title: '事件列表', visible: true },
                    ],
                  },
                ],
              },
            ],
          },
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
