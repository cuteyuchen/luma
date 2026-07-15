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
import {
  COCKPIT_SCHEMA_VERSION,
  createCockpitId,
  createGridCell,
  createGridColumn,
  createGridRow,
  createLayout,
  DEFAULT_COLUMN_WIDTH,
} from './defaults'

/***********************配置标准化*********************/

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function arrayOf(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function text(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback
}

function positive(value: unknown, fallback: number): number {
  const numberValue = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : fallback
}

function normalizeWidget(raw: unknown): CockpitWidgetInstance | undefined {
  if (!isRecord(raw) || typeof raw.type !== 'string' || !raw.type.trim())
    return undefined
  return {
    id: text(raw.id, createCockpitId('widget')),
    type: raw.type,
    title: typeof raw.title === 'string' && raw.title.trim() ? raw.title : undefined,
  }
}

function normalizeCell(raw: unknown): CockpitGridCellConfig {
  const source = isRecord(raw) ? raw : {}
  return {
    id: text(source.id, createCockpitId('cell')),
    widget: normalizeWidget(source.widget),
  }
}

function normalizeColumns(raw: unknown): CockpitGridColumnConfig[] {
  const columns = arrayOf(raw).map((item) => {
    const source = isRecord(item) ? item : {}
    return {
      id: text(source.id, createCockpitId('column')),
      width: Math.round(positive(source.width, DEFAULT_COLUMN_WIDTH)),
    }
  })
  return columns.length ? columns : [createGridColumn()]
}

function normalizeRow(raw: unknown, columnCount: number): CockpitGridRowConfig {
  const source = isRecord(raw) ? raw : {}
  const mode: CockpitGridRowMode = source.mode === 'tabs' ? 'tabs' : 'grid'
  const row: CockpitGridRowConfig = {
    id: text(source.id, createCockpitId('row')),
    height: positive(source.height, 100),
    mode,
    cells: [],
    widgets: [],
  }

  if (mode === 'tabs') {
    row.widgets = arrayOf(source.widgets)
      .map(normalizeWidget)
      .filter((widget): widget is CockpitWidgetInstance => Boolean(widget))
    const active = typeof source.activeWidgetId === 'string' ? source.activeWidgetId : undefined
    row.activeWidgetId = row.widgets.some(widget => widget.id === active) ? active : row.widgets[0]?.id
  }
  else {
    const cells = arrayOf(source.cells).map(normalizeCell).slice(0, columnCount)
    while (cells.length < columnCount)
      cells.push(createGridCell())
    row.cells = cells
  }

  return row
}

function normalizeRowHeights(rows: CockpitGridRowConfig[]): void {
  const total = rows.reduce((sum, row) => sum + row.height, 0)
  if (total <= 0) {
    const height = 100 / rows.length
    rows.forEach((row) => {
      row.height = height
    })
    return
  }
  rows.forEach((row) => {
    row.height = Number(((row.height / total) * 100).toFixed(3))
  })
  const remainder = Number((100 - rows.reduce((sum, row) => sum + row.height, 0)).toFixed(3))
  if (rows[rows.length - 1])
    rows[rows.length - 1].height = Number((rows[rows.length - 1].height + remainder).toFixed(3))
}

function normalizeRegion(raw: unknown): CockpitRegionConfig {
  const source = isRecord(raw) ? raw : {}
  const columns = normalizeColumns(source.columns)
  const rows = arrayOf(source.rows).map(item => normalizeRow(item, columns.length))
  if (!rows.length)
    rows.push(createGridRow(columns.length))
  normalizeRowHeights(rows)
  return { columns, rows }
}

function normalizeLayout(raw: unknown): CockpitLayoutConfig {
  const source = isRecord(raw) ? raw : {}
  const layout = createLayout(text(source.title, '未命名布局'))
  layout.id = text(source.id, layout.id)
  layout.left = normalizeRegion(source.left)
  layout.right = normalizeRegion(source.right)
  return layout
}

export function normalizeCockpitConfig(raw: unknown): CockpitConfig {
  const source = isRecord(raw) ? raw : {}
  const layouts = arrayOf(source.layouts).map(normalizeLayout)
  const config: CockpitConfig = {
    schemaVersion: COCKPIT_SCHEMA_VERSION,
    id: text(source.id, createCockpitId('cockpit')),
    title: text(source.title, '驾驶舱'),
    layouts: layouts.length ? layouts : [createLayout('布局 1')],
  }
  const requested = typeof source.activeLayoutId === 'string' ? source.activeLayoutId : undefined
  config.activeLayoutId = config.layouts.some(layout => layout.id === requested)
    ? requested
    : config.layouts[0].id
  return config
}
