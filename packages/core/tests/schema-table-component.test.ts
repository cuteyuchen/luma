import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { LumaSchemaTable } from '../src/components/schema-table'

describe('luma schema table', () => {
  it('会渲染可见列，并使用 formatter 输出单元格', () => {
    const wrapper = mount(LumaSchemaTable, {
      props: {
        rowKey: 'id',
        columns: [
          {
            field: 'name',
            label: '名称',
          },
          {
            field: 'status',
            label: '状态',
            formatter: value => value === 'enabled' ? '启用' : '停用',
          },
          {
            field: 'secret',
            label: '隐藏字段',
            hidden: true,
          },
        ],
        rows: [
          {
            id: 'row-1',
            name: 'Luma',
            status: 'enabled',
            secret: '不可见',
          },
        ],
      },
    })

    const headers = wrapper.findAll('th').map(item => item.text())
    const cells = wrapper.findAll('td').map(item => item.text())

    expect(headers).toEqual(['名称', '状态'])
    expect(cells).toEqual(['Luma', '启用'])
    expect(wrapper.text()).not.toContain('不可见')
  })

  it('没有数据时会显示空状态', () => {
    const wrapper = mount(LumaSchemaTable, {
      props: {
        emptyText: '暂无项目',
        columns: [
          {
            field: 'name',
            label: '名称',
          },
        ],
        rows: [],
      },
    })

    expect(wrapper.find('.luma-schema-table__empty').text()).toBe('暂无项目')
  })
})
