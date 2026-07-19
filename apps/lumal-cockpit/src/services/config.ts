import type { CockpitConfig } from '@lumal/cockpit'
import { COCKPIT_SCHEMA_VERSION, prepareCockpitConfig } from '@lumal/cockpit'

/***********************独立应用配置与保存实现*********************/

const STORAGE_KEY = 'lumal-cockpit:config'

const defaultConfig: CockpitConfig = {
  schemaVersion: 3,
  id: 'standalone-cockpit',
  title: '全国智慧运行态势',
  activeLayoutId: 'layout-overview',
  layouts: [
    {
      id: 'layout-overview',
      title: '综合态势',
      left: {
        width: 420,
        columns: [{ id: 'left-overview-column', width: 420 }],
        rows: [
          {
            id: 'left-overview-summary',
            height: 42,
            mode: 'grid',
            widgets: [],
            cells: [{ id: 'left-overview-summary-cell', widget: { id: 'w-metric-summary-a', type: 'metric-summary', title: '核心运行指标' } }],
          },
          {
            id: 'left-overview-tabs',
            height: 58,
            mode: 'tabs',
            cells: [],
            activeWidgetId: 'w-trend-main',
            widgets: [
              { id: 'w-trend-main', type: 'trend-panel', title: '近七日运行趋势' },
              { id: 'w-status-tabs', type: 'status-distribution', title: '区域状态分布' },
            ],
          },
        ],
      },
      right: {
        width: 420,
        columns: [{ id: 'right-overview-column', width: 420 }],
        rows: [
          {
            id: 'right-overview-events',
            height: 50,
            mode: 'grid',
            widgets: [],
            cells: [{ id: 'right-overview-events-cell', widget: { id: 'w-event-list', type: 'event-list', title: '实时告警动态' } }],
          },
          {
            id: 'right-overview-tabs',
            height: 50,
            mode: 'tabs',
            cells: [],
            activeWidgetId: 'w-region-ranking',
            widgets: [
              { id: 'w-region-ranking', type: 'region-ranking', title: '区域运行指数' },
              { id: 'w-metric-summary-b', type: 'metric-summary', title: '重点节点概览' },
            ],
          },
        ],
      },
    },
    {
      id: 'layout-analysis',
      title: '运行分析',
      left: {
        width: 420,
        columns: [{ id: 'left-analysis-column', width: 420 }],
        rows: [
          {
            id: 'left-analysis-tabs',
            height: 100,
            mode: 'tabs',
            cells: [],
            activeWidgetId: 'w-trend-analysis',
            widgets: [
              { id: 'w-trend-analysis', type: 'trend-panel', title: '运行趋势对比' },
              { id: 'w-status-analysis', type: 'status-distribution', title: '区域状态分布' },
            ],
          },
        ],
      },
      right: {
        width: 420,
        columns: [{ id: 'right-analysis-column', width: 420 }],
        rows: [
          {
            id: 'right-analysis-tabs',
            height: 100,
            mode: 'tabs',
            cells: [],
            activeWidgetId: 'w-region-ranking-analysis',
            widgets: [
              { id: 'w-region-ranking-analysis', type: 'region-ranking', title: '区域运行指数' },
              { id: 'w-event-list-analysis', type: 'event-list', title: '实时告警动态' },
            ],
          },
        ],
      },
    },
  ],
}

export function loadStandaloneConfig(): CockpitConfig {
  if (typeof localStorage !== 'undefined') {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { schemaVersion?: unknown }
        if (parsed.schemaVersion === COCKPIT_SCHEMA_VERSION)
          return prepareCockpitConfig(parsed)
      }
      catch {
        // 忽略损坏的本地配置。
      }
      localStorage.removeItem(STORAGE_KEY)
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
