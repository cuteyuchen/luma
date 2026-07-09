import { describe, expect, it } from 'vitest'
import { normalizeSchemaTableColumns } from '../src/components/schema-table'

describe('schema table normalize', () => {
  it('会过滤空字段，并标记隐藏列不可渲染', () => {
    const columns = normalizeSchemaTableColumns([
      {
        field: '',
        label: '空字段',
      },
      {
        field: 'name',
        label: '名称',
      },
      {
        field: 'secret',
        label: '隐藏字段',
        hidden: true,
      },
    ])

    expect(columns).toHaveLength(2)
    expect(columns[0]?.field).toBe('name')
    expect(columns[0]?.renderable).toBe(true)
    expect(columns[1]?.field).toBe('secret')
    expect(columns[1]?.renderable).toBe(false)
  })

  it('会补齐默认对齐方式和空值占位', () => {
    const columns = normalizeSchemaTableColumns([
      {
        field: 'status',
        label: '状态',
      },
    ])

    expect(columns[0]?.align).toBe('left')
    expect(columns[0]?.emptyText).toBe('-')
  })
})
