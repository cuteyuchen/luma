import type { CockpitConfig } from '../src/types'
import { describe, expect, it } from 'vitest'
import {
  COCKPIT_SCHEMA_VERSION,
  normalizeCockpitConfig,
  prepareCockpitConfig,
  validateCockpitConfig,
} from '../src/config'

function validConfig(): CockpitConfig {
  return {
    schemaVersion: 3,
    id: 'cockpit',
    title: '测试驾驶舱',
    activeLayoutId: 'layout-a',
    layouts: [{
      id: 'layout-a',
      title: '布局 A',
      left: {
        width: 320,
        columns: [{ id: 'left-col', width: 320 }],
        rows: [{ id: 'left-row', height: 100, mode: 'grid', widgets: [], cells: [{ id: 'left-cell' }] }],
      },
      right: {
        width: 320,
        columns: [{ id: 'right-col', width: 320 }],
        rows: [{ id: 'right-row', height: 100, mode: 'tabs', cells: [], widgets: [{ id: 'widget-a', type: 'stub' }], activeWidgetId: 'widget-a' }],
      },
    }],
  }
}

describe('v3 配置标准化', () => {
  it('补齐区域行列、空槽并将行高归一为 100%', () => {
    const result = normalizeCockpitConfig({
      schemaVersion: 3,
      id: 'cockpit',
      title: '测试',
      layouts: [{ id: 'layout', title: '布局', left: { columns: [], rows: [] }, right: { columns: [], rows: [] } }],
    })
    const region = result.layouts[0].left
    expect(result.schemaVersion).toBe(COCKPIT_SCHEMA_VERSION)
    expect(region.columns).toHaveLength(1)
    expect(region.width).toBeGreaterThan(0)
    expect(region.columns.reduce((sum, column) => sum + column.width, 0)).toBe(region.width)
    expect(region.rows).toHaveLength(1)
    expect(region.rows[0].cells).toHaveLength(1)
    expect(region.rows.reduce((sum, row) => sum + row.height, 0)).toBe(100)
    expect(() => JSON.stringify(result)).not.toThrow()
  })

  it('区域宽按列数均分列宽，并从旧列宽和推导区域宽', () => {
    const result = normalizeCockpitConfig({
      schemaVersion: 3,
      layouts: [{
        id: 'layout',
        title: '布局',
        left: {
          columns: [{ id: 'a', width: 200 }, { id: 'b', width: 400 }],
          rows: [{ id: 'row', height: 100, mode: 'grid', cells: [{ id: 'c1' }, { id: 'c2' }], widgets: [] }],
        },
        right: {
          width: 500,
          columns: [{ id: 'r1', width: 100 }, { id: 'r2', width: 100 }],
          rows: [{ id: 'right-row', height: 100, mode: 'grid', cells: [{ id: 'rc1' }, { id: 'rc2' }], widgets: [] }],
        },
      }],
    })
    const left = result.layouts[0].left
    expect(left.width).toBe(600)
    expect(left.columns.map(column => column.width)).toEqual([300, 300])
    const right = result.layouts[0].right
    expect(right.width).toBe(500)
    expect(right.columns.map(column => column.width)).toEqual([250, 250])
  })

  it('tab 行清除普通槽并回退不存在的激活项', () => {
    const result = normalizeCockpitConfig({
      schemaVersion: 3,
      layouts: [{
        id: 'layout',
        title: '布局',
        left: { width: 320, columns: [{ id: 'col', width: 320 }], rows: [{ id: 'row', height: 100, mode: 'tabs', cells: [{ id: 'unused' }], widgets: [{ id: 'w1', type: 'stub' }], activeWidgetId: 'missing' }] },
        right: { width: 320, columns: [{ id: 'right', width: 320 }], rows: [{ id: 'right-row', height: 100, mode: 'grid', cells: [{ id: 'right-cell' }], widgets: [] }] },
      }],
    })
    const row = result.layouts[0].left.rows[0]
    expect(row.cells).toEqual([])
    expect(row.activeWidgetId).toBe('w1')
  })

  it('拒绝旧 schema 的加载管线', () => {
    expect(() => prepareCockpitConfig({ schemaVersion: 2, categories: [] })).toThrow(/仅支持 v3/)
  })
})

describe('v3 配置校验', () => {
  it('合法网格配置通过校验', () => {
    expect(validateCockpitConfig(validConfig()).valid).toBe(true)
  })

  it('阻止重复模块 id 与不完整普通行', () => {
    const config = validConfig()
    config.layouts[0].left.rows[0].cells[0].widget = { id: 'widget-a', type: 'stub' }
    config.layouts[0].left.rows[0].cells.push({ id: 'extra' })
    const result = validateCockpitConfig(config)
    expect(result.valid).toBe(false)
    expect(result.issues.some(issue => issue.message.includes('重复 id'))).toBe(true)
    expect(result.issues.some(issue => issue.message.includes('单元格数量'))).toBe(true)
  })
})
