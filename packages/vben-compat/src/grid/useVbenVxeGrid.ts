import type {
  CrudTablePageChangePayload,
  CrudTableQueryModel,
  SchemaTableRow,
} from '@luma/core/components'
import type {
  LumaCrudTableCompatProps,
  UseVbenVxeGridInput,
  UseVbenVxeGridReturn,
} from '../types'
import { computed, reactive, shallowRef, toRef, watch } from 'vue'
import {
  adaptVbenGridColumns,
  adaptVbenGridProxyResult,
  adaptVbenGridQuerySchemas,
  replaceVbenGridQueryModel,
  resolveVbenGridOptions,
} from './adapter'

/***********************表格组合函数*********************/
export function useVbenVxeGrid(options: UseVbenVxeGridInput = {}): UseVbenVxeGridReturn {
  const optionsRef = toRef(options)
  const gridInstance = shallowRef<unknown>()
  const rows = shallowRef<SchemaTableRow[]>([])
  const total = shallowRef(0)
  const loading = shallowRef(false)
  const page = shallowRef(1)
  const pageSize = shallowRef(10)
  const queryModel = reactive<CrudTableQueryModel>({})

  const gridOptions = computed(() => resolveVbenGridOptions(optionsRef.value))
  const lumaColumns = computed(() => adaptVbenGridColumns(gridOptions.value.columns))
  const querySchemas = computed(() => adaptVbenGridQuerySchemas(gridOptions.value))
  const pagination = computed(() => gridOptions.value.pagerConfig !== false && gridOptions.value.pagerConfig?.enabled !== false)
  const pageSizes = computed(() => {
    const pagerConfig = gridOptions.value.pagerConfig

    return pagerConfig === false ? undefined : pagerConfig?.pageSizes
  })

  watch(
    () => gridOptions.value.pagerConfig,
    (pagerConfig) => {
      if (pagerConfig !== false && pagerConfig?.pageSize) {
        pageSize.value = pagerConfig.pageSize
      }
    },
    { immediate: true },
  )

  function register(instance?: unknown): void {
    gridInstance.value = instance
  }

  function getQueryModel(): CrudTableQueryModel {
    return {
      ...queryModel,
    }
  }

  function setQueryModel(model: CrudTableQueryModel): void {
    replaceVbenGridQueryModel(queryModel, model)
  }

  function setRows(nextRows: SchemaTableRow[], nextTotal = nextRows.length): void {
    rows.value = nextRows
    total.value = nextTotal
  }

  function setLoading(nextLoading: boolean): void {
    loading.value = nextLoading
  }

  function reload(): void {
    const query = gridOptions.value.proxyConfig?.ajax?.query

    if (!query) {
      return
    }

    loading.value = true

    Promise.resolve(query({
      ...getQueryModel(),
      page: page.value,
      pageSize: pageSize.value,
    }))
      .then((result) => {
        const tableResult = adaptVbenGridProxyResult(result, gridOptions.value)
        setRows(tableResult.rows, tableResult.total)
      })
      .finally(() => {
        loading.value = false
      })
  }

  function search(payload: CrudTableQueryModel = getQueryModel()): void {
    setQueryModel(payload)
    page.value = 1
    reload()
  }

  function reset(): void {
    setQueryModel({})
    page.value = 1
    reload()
  }

  function handleSearch(payload: CrudTableQueryModel = getQueryModel()): void {
    search(payload)
  }

  function handleReset(payload: CrudTableQueryModel = {}): void {
    setQueryModel(payload)
    page.value = 1
    reload()
  }

  function handlePageChange(payload: CrudTablePageChangePayload): void {
    page.value = payload.page
    pageSize.value = payload.pageSize
    reload()
  }

  const crudTableProps = computed<LumaCrudTableCompatProps>(() => ({
    'columns': lumaColumns.value,
    'emptyText': gridOptions.value.emptyText,
    'loading': loading.value,
    'onPageChange': handlePageChange,
    'onReset': handleReset,
    'onSearch': handleSearch,
    'onUpdate:page': (nextPage: number) => {
      page.value = nextPage
    },
    'onUpdate:pageSize': (nextPageSize: number) => {
      pageSize.value = nextPageSize
    },
    'onUpdate:queryModel': setQueryModel,
    'page': page.value,
    'pageSize': pageSize.value,
    'pageSizes': pageSizes.value,
    'pagination': pagination.value,
    'queryModel': getQueryModel(),
    'querySchemas': querySchemas.value,
    'resetText': gridOptions.value.formOptions?.resetText ?? gridOptions.value.resetText,
    'rowKey': gridOptions.value.rowKey,
    'rows': rows.value,
    'searchText': gridOptions.value.formOptions?.submitText ?? gridOptions.value.searchText,
    'title': gridOptions.value.title,
    'total': total.value,
  }))

  return [
    register,
    {
      crudTableProps,
      getGridInstance: () => gridInstance.value,
      getLumaColumns: () => lumaColumns.value,
      getQueryModel,
      getRows: () => rows.value,
      getTotal: () => total.value,
      handlePageChange,
      handleReset,
      handleSearch,
      reload,
      reset,
      search,
      setLoading,
      setQueryModel,
      setRows,
    },
  ]
}
