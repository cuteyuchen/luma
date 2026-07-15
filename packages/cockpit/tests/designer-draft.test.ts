import type { CockpitConfig } from '../src/types'
import { describe, expect, it } from 'vitest'
import { useCockpitDraft } from '../src/designer/useCockpitDraft'

function sourceConfig(): CockpitConfig {
  return {
    schemaVersion: 3,
    id: 'cockpit',
    title: '原始',
    activeLayoutId: 'layout',
    layouts: [{
      id: 'layout',
      title: '布局',
      left: {
        columns: [{ id: 'left-a', width: 320 }, { id: 'left-b', width: 320 }],
        rows: [{ id: 'left-row', height: 100, mode: 'grid', widgets: [], cells: [{ id: 'left-cell-a' }, { id: 'left-cell-b' }] }],
      },
      right: {
        columns: [{ id: 'right-a', width: 320 }],
        rows: [{ id: 'right-row', height: 100, mode: 'grid', widgets: [], cells: [{ id: 'right-cell' }] }],
      },
    }],
  }
}

describe('v3 useCockpitDraft', () => {
  it('编辑布局不污染原始配置，并支持新增布局', () => {
    const source = sourceConfig()
    const draft = useCockpitDraft(source)
    draft.renameLayout('layout', '改名')
    draft.addLayout()
    expect(source.layouts).toHaveLength(1)
    expect(source.layouts[0].title).toBe('布局')
    expect(draft.layouts.value).toHaveLength(2)
  })

  it('行高自动重分配到 100%', () => {
    const draft = useCockpitDraft(sourceConfig())
    draft.resizeRegion('left', 2, 2)
    const rows = draft.activeLayout.value!.left.rows
    draft.setRowHeight('left', rows[0].id, 70)
    expect(rows.reduce((sum, row) => sum + row.height, 0)).toBeCloseTo(100, 3)
    expect(rows[0].height).toBeCloseTo(70, 3)
  })

  it('缩减含模块的列被阻止，显式丢弃才会执行', () => {
    const draft = useCockpitDraft(sourceConfig())
    draft.addWidget({ kind: 'cell', side: 'left', rowId: 'left-row', cellId: 'left-cell-b' }, 'stub')
    expect(draft.resizeRegion('left', 1, 1)).toBe(false)
    expect(draft.resizeRegion('left', 1, 1, true)).toBe(true)
    expect(draft.activeLayout.value!.left.columns).toHaveLength(1)
  })

  it('普通行可转换为 Tab 行并安全还原', () => {
    const draft = useCockpitDraft(sourceConfig())
    draft.addWidget({ kind: 'cell', side: 'left', rowId: 'left-row', cellId: 'left-cell-a' }, 'a')
    draft.addWidget({ kind: 'cell', side: 'left', rowId: 'left-row', cellId: 'left-cell-b' }, 'b')
    expect(draft.setRowTabs('left', 'left-row', true)).toBe(true)
    const row = draft.activeLayout.value!.left.rows[0]
    expect(row.mode).toBe('tabs')
    expect(row.widgets).toHaveLength(2)
    expect(draft.setRowTabs('left', 'left-row', false)).toBe(true)
    expect(row.cells.filter(cell => cell.widget)).toHaveLength(2)
  })

  it('移动到占用槽需要替换确认', () => {
    const draft = useCockpitDraft(sourceConfig())
    const source = { kind: 'cell' as const, side: 'left' as const, rowId: 'left-row', cellId: 'left-cell-a' }
    const target = { kind: 'cell' as const, side: 'right' as const, rowId: 'right-row', cellId: 'right-cell' }
    draft.addWidget(source, 'source')
    draft.addWidget(target, 'target')
    expect(draft.moveWidget(source, target)).toEqual({ moved: false, requiresReplace: true })
    expect(draft.moveWidget(source, target, true).moved).toBe(true)
    expect(draft.activeLayout.value!.right.rows[0].cells[0].widget?.type).toBe('source')
  })
})
