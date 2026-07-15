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
        columns: [{ id: 'left-col', width: 320 }],
        rows: [{ id: 'left-row', height: 100, mode: 'grid', widgets: [], cells: [{ id: 'left-cell' }] }],
      },
      right: {
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
    expect(region.rows).toHaveLength(1)
    expect(region.rows[0].cells).toHaveLength(1)
    expect(region.rows.reduce((sum, row) => sum + row.height, 0)).toBe(100)
    expect(() => JSON.stringify(result)).not.toThrow()
  })

  it('tab 行清除普通槽并回退不存在的激活项', () => {
    const result = normalizeCockpitConfig({
      schemaVersion: 3,
      layouts: [{
        id: 'layout',
        title: '布局',
        left: { columns: [{ id: 'col', width: 320 }], rows: [{ id: 'row', height: 100, mode: 'tabs', cells: [{ id: 'unused' }], widgets: [{ id: 'w1', type: 'stub' }], activeWidgetId: 'missing' }] },
        right: { columns: [{ id: 'right', width: 320 }], rows: [{ id: 'right-row', height: 100, mode: 'grid', cells: [{ id: 'right-cell' }], widgets: [] }] },
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
