import type { App } from 'vue'
import LumalChartComp from './LumalChart.vue'
import LumalChartPanelComp from './LumalChartPanel.vue'

/***********************组件安装包装*********************/
type WithInstall<T> = T & { install: (app: App) => void }

function withInstall<T extends Record<string, unknown>>(component: T, name: string): WithInstall<T> {
  const installable = component as WithInstall<T>

  installable.install = function install(app: App): void {
    app.component(name, component as never)
  }

  return installable
}

/***********************导出*********************/
export const LumalChart = withInstall(LumalChartComp as unknown as Record<string, unknown>, 'LumalChart') as typeof LumalChartComp & { install: (app: App) => void }
export const LumalChartPanel = withInstall(LumalChartPanelComp as unknown as Record<string, unknown>, 'LumalChartPanel') as typeof LumalChartPanelComp & { install: (app: App) => void }

export {
  resolveChartPanelStyle,
} from './panel-style'
export type {
  ChartPanelStyle,
  ChartPanelWidth,
} from './panel-style'
export {
  useChartResize,
} from './useChartResize'
export type {
  ChartResizeTarget,
  UseChartResizeOptions,
} from './useChartResize'
