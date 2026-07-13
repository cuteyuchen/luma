import type {
  CockpitConfig,
  CockpitGridCellConfig,
  CockpitGridColumnConfig,
  CockpitGridRowConfig,
  CockpitGridRowMode,
  CockpitLayoutConfig,
  CockpitRegionConfig,
  CockpitWidgetInstance,
} from '../types'

/***********************常量*********************/

/** v3 移除了分类、页面与中心组件配置。 */
export const COCKPIT_SCHEMA_VERSION = 3
export const DEFAULT_COLUMN_WIDTH = 320
export const DEFAULT_ROW_HEIGHT = 100

/***********************ID 生成*********************/

let idCounter = 0

export function createCockpitId(prefix = 'ck'): string {
  idCounter += 1
  const time = Date.now().toString(36)
  const rand = Math.random().toString(36).slice(2, 8)
  return `${prefix}-${time}-${idCounter.toString(36)}-${rand}`
}

/***********************工厂函数*********************/

export function createWidgetInstance(type: string, title?: string): CockpitWidgetInstance {
  return { id: createCockpitId('widget'), type, title }
}

export function createGridColumn(width = DEFAULT_COLUMN_WIDTH): CockpitGridColumnConfig {
  return { id: createCockpitId('column'), width }
}

export function createGridCell(): CockpitGridCellConfig {
  return { id: createCockpitId('cell') }
}

export function createGridRow(
  columnCount: number,
  mode: CockpitGridRowMode = 'grid',
  height = DEFAULT_ROW_HEIGHT,
): CockpitGridRowConfig {
  return {
    id: createCockpitId('row'),
    height,
    mode,
    cells: mode === 'grid' ? Array.from({ length: Math.max(1, columnCount) }, createGridCell) : [],
    widgets: [],
  }
}

export function createRegion(columnCount = 1, rowCount = 1): CockpitRegionConfig {
  const columns = Array.from({ length: Math.max(1, columnCount) }, createGridColumn)
  const rows = Array.from({ length: Math.max(1, rowCount) }, () => createGridRow(columns.length, 'grid', 100 / Math.max(1, rowCount)))
  return { columns, rows }
}

export function createLayout(title = '新布局'): CockpitLayoutConfig {
  return {
    id: createCockpitId('layout'),
    title,
    left: createRegion(),
    right: createRegion(),
  }
}

export function createDefaultCockpitConfig(id = createCockpitId('cockpit')): CockpitConfig {
  const layout = createLayout('布局 1')
  return {
    schemaVersion: COCKPIT_SCHEMA_VERSION,
    id,
    title: '驾驶舱',
    activeLayoutId: layout.id,
    layouts: [layout],
  }
}
