import { describe, expect, it, vi } from 'vitest'
import { shallowRef } from 'vue'
import {
  adaptVbenGridColumns,
  adaptVbenGridProxyResult,
  useVbenVxeGrid,
} from '../src'

describe('useVbenVxeGrid', () => {
  it('会把常见 Vben grid columns 适配为 LumaSchemaTable columns', () => {
    const columns = adaptVbenGridColumns([
      {
        field: 'name',
        title: '名称',
        width: 180,
      },
      {
        field: 'status',
        hidden: true,
        label: '状态',
      },
      {
        field: 'selection',
        title: '勾选',
        type: 'checkbox',
      },
    ])

    expect(columns).toEqual([
      {
        align: undefined,
        field: 'name',
        formatter: undefined,
        hidden: false,
        label: '名称',
        width: 180,
      },
      {
        align: undefined,
        field: 'status',
        formatter: undefined,
        hidden: true,
        label: '状态',
        width: undefined,
      },
    ])
  })

  it('会生成可绑定给 LumaCrudTable 的 props', () => {
    const [register, gridApi] = useVbenVxeGrid({
      gridOptions: {
        columns: [
          {
            field: 'name',
            title: '名称',
          },
        ],
        formOptions: {
          schemas: [
            {
              component: 'Input',
              fieldName: 'keyword',
              label: '关键词',
            },
          ],
          submitText: '查询',
        },
        pagerConfig: {
          pageSize: 20,
          pageSizes: [20, 50],
        },
        rowKey: 'id',
        title: '用户列表',
      },
    })

    const gridInstance = { refresh: () => undefined }
    register(gridInstance)
    gridApi.setRows([{ id: 1, name: 'Luma' }], 1)

    expect(gridApi.getGridInstance()).toBe(gridInstance)
    expect(gridApi.crudTableProps.value.title).toBe('用户列表')
    expect(gridApi.crudTableProps.value.rowKey).toBe('id')
    expect(gridApi.crudTableProps.value.columns.map(item => item.field)).toEqual(['name'])
    expect(gridApi.crudTableProps.value.querySchemas.map(item => item.field)).toEqual(['keyword'])
    expect(gridApi.crudTableProps.value.searchText).toBe('查询')
    expect(gridApi.crudTableProps.value.pageSize).toBe(20)
    expect(gridApi.crudTableProps.value.pageSizes).toEqual([20, 50])
    expect(gridApi.crudTableProps.value.rows).toEqual([{ id: 1, name: 'Luma' }])
    expect(gridApi.crudTableProps.value.total).toBe(1)
  })

  it('会通过 proxyConfig.ajax.query 加载数据并更新 rows 和 total', async () => {
    const query = vi.fn(() => Promise.resolve({
      items: [
        { id: 1, name: 'Luma' },
      ],
      total: 8,
    }))
    const [, gridApi] = useVbenVxeGrid({
      gridOptions: {
        columns: [
          {
            field: 'name',
            title: '名称',
          },
        ],
        proxyConfig: {
          ajax: {
            query,
          },
        },
      },
    })

    gridApi.search({
      keyword: 'Lu',
    })
    await Promise.resolve()
    await Promise.resolve()

    expect(query).toHaveBeenCalledWith({
      keyword: 'Lu',
      page: 1,
      pageSize: 10,
    })
    expect(gridApi.getRows()).toEqual([{ id: 1, name: 'Luma' }])
    expect(gridApi.getTotal()).toBe(8)
    expect(gridApi.crudTableProps.value.loading).toBe(false)
  })

  it('支持嵌套 result 和自定义列表字段', () => {
    const result = adaptVbenGridProxyResult(
      {
        data: {
          records: [
            { id: 1, name: 'Luma' },
          ],
          totalCount: 3,
        },
      },
      {
        proxyConfig: {
          props: {
            items: 'records',
            result: 'data',
            total: 'totalCount',
          },
        },
      },
    )

    expect(result).toEqual({
      rows: [
        { id: 1, name: 'Luma' },
      ],
      total: 3,
    })
  })

  it('支持响应式 options 更新 columns', () => {
    const options = shallowRef({
      gridOptions: {
        columns: [
          {
            field: 'name',
            title: '名称',
          },
        ],
      },
    })
    const [, gridApi] = useVbenVxeGrid(options)

    expect(gridApi.getLumaColumns()[0]?.field).toBe('name')

    options.value = {
      gridOptions: {
        columns: [
          {
            field: 'status',
            title: '状态',
          },
        ],
      },
    }

    expect(gridApi.getLumaColumns()[0]?.field).toBe('status')
  })
})
