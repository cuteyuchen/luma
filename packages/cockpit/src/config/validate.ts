import type {
  CockpitConfig,
  CockpitConfigIssue,
  CockpitGridRowConfig,
  CockpitRegionConfig,
} from '../types'
import { COCKPIT_SCHEMA_VERSION } from './defaults'

/***********************配置校验*********************/

export interface CockpitValidationResult {
  valid: boolean
  issues: CockpitConfigIssue[]
}

function addDuplicateIssue(seen: Set<string>, issues: CockpitConfigIssue[], id: string, scope: string, path: string[]): void {
  if (seen.has(id))
    issues.push({ level: 'error', message: `${scope} 存在重复 id：${id}`, path })
  seen.add(id)
}

function validateRow(row: CockpitGridRowConfig, region: CockpitRegionConfig, path: string[], widgetIds: Set<string>, issues: CockpitConfigIssue[]): void {
  if (!(row.height > 0))
    issues.push({ level: 'error', message: '行高必须大于 0%。', path })
  if (row.mode === 'grid' && row.cells.length !== region.columns.length)
    issues.push({ level: 'error', message: '普通行的单元格数量必须与列数一致。', path })
  if (row.mode === 'tabs' && row.cells.length)
    issues.push({ level: 'error', message: 'Tab 行不能保留普通单元格。', path })

  const widgets = row.mode === 'tabs'
    ? row.widgets
    : row.cells.flatMap(cell => cell.widget ? [cell.widget] : [])
  widgets.forEach((widget) => {
    addDuplicateIssue(widgetIds, issues, widget.id, '模块实例', [...path, widget.id])
    if (!widget.type.trim())
      issues.push({ level: 'error', message: '模块类型不能为空。', path: [...path, widget.id] })
  })
  if (row.mode === 'tabs' && row.activeWidgetId && !row.widgets.some(widget => widget.id === row.activeWidgetId))
    issues.push({ level: 'error', message: '当前 Tab 不存在。', path })
}

function validateRegion(region: CockpitRegionConfig, path: string[], widgetIds: Set<string>, issues: CockpitConfigIssue[]): void {
  if (!region.columns.length)
    issues.push({ level: 'error', message: '区域至少需要一列。', path })
  if (!region.rows.length)
    issues.push({ level: 'error', message: '区域至少需要一行。', path })
  if (!(region.width > 0))
    issues.push({ level: 'error', message: '区域宽度必须大于 0 像素。', path })
  const columnIds = new Set<string>()
  const columnSum = region.columns.reduce((sum, column) => sum + column.width, 0)
  region.columns.forEach((column) => {
    addDuplicateIssue(columnIds, issues, column.id, '列', [...path, column.id])
    if (!(column.width > 0))
      issues.push({ level: 'error', message: '列宽必须大于 0 像素。', path: [...path, column.id] })
  })
  if (region.columns.length && region.width > 0 && columnSum !== region.width)
    issues.push({ level: 'error', message: '列宽总和必须等于区域宽度。', path })
  const rowIds = new Set<string>()
  region.rows.forEach((row) => {
    addDuplicateIssue(rowIds, issues, row.id, '行', [...path, row.id])
    validateRow(row, region, [...path, row.id], widgetIds, issues)
  })
  const totalHeight = region.rows.reduce((sum, row) => sum + row.height, 0)
  if (Math.abs(totalHeight - 100) > 0.01)
    issues.push({ level: 'error', message: '区域行高总和必须为 100%。', path })
}

export function validateCockpitConfig(config: CockpitConfig): CockpitValidationResult {
  const issues: CockpitConfigIssue[] = []
  if (config.schemaVersion !== COCKPIT_SCHEMA_VERSION)
    issues.push({ level: 'error', message: `配置版本必须为 v${COCKPIT_SCHEMA_VERSION}。` })
  if (!config.layouts.length)
    issues.push({ level: 'error', message: '驾驶舱至少需要一个布局。' })
  const layoutIds = new Set<string>()
  const widgetIds = new Set<string>()
  config.layouts.forEach((layout) => {
    addDuplicateIssue(layoutIds, issues, layout.id, '布局', [layout.id])
    if (!layout.title.trim())
      issues.push({ level: 'error', message: '布局名称不能为空。', path: [layout.id] })
    validateRegion(layout.left, [layout.id, 'left'], widgetIds, issues)
    validateRegion(layout.right, [layout.id, 'right'], widgetIds, issues)
  })
  return { valid: !issues.some(issue => issue.level === 'error'), issues }
}
