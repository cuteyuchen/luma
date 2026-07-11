import type {
  CrudTablePageChangePayload,
  CrudTableProps,
  CrudTableQueryModel,
  SchemaFormItem,
  SchemaFormModel,
  SchemaFormOption,
  SchemaTableAlign,
  SchemaTableCellFormatter,
  SchemaTableColumn,
  SchemaTableRow,
} from '@luma/core/components'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'

export type VbenFormComponent
  = | 'CheckboxGroup'
    | 'DatePicker'
    | 'DatePicker.RangePicker'
    | 'Hidden'
    | 'Input'
    | 'InputNumber'
    | 'Input.Password'
    | 'Input.TextArea'
    | 'RadioGroup'
    | 'Select'
    | 'Switch'
    | 'Textarea'
    | 'TreeSelect'
    | 'Upload'
    | (string & {})

export interface VbenFormRule {
  required?: boolean
}

export interface VbenFormComponentProps {
  disabled?: boolean
  options?: SchemaFormOption[]
  placeholder?: string
  type?: string
  [key: string]: unknown
}

export interface VbenFormSchema {
  label: string
  component?: VbenFormComponent
  componentProps?: VbenFormComponentProps
  defaultValue?: unknown
  field?: string
  fieldName?: string
  hidden?: boolean
  ifShow?: boolean
  required?: boolean
  rules?: VbenFormRule[]
  show?: boolean
}

export interface UseVbenFormOptions {
  schemas?: VbenFormSchema[]
  model?: SchemaFormModel
  showActions?: boolean
  submitText?: string
  submit?: (model: SchemaFormModel) => void
}

export type UseVbenFormInput = MaybeRefOrGetter<UseVbenFormOptions>

export interface LumaSchemaFormCompatProps {
  'modelValue': SchemaFormModel
  'onUpdate:modelValue': (model: SchemaFormModel) => void
  'onSubmit': (model: SchemaFormModel) => void
  'schemas': SchemaFormItem[]
  'showActions'?: boolean
  'submitText'?: string
}

export type VbenFormRegister = (formInstance?: unknown) => void

export interface VbenFormApi {
  schemaFormProps: ComputedRef<LumaSchemaFormCompatProps>
  getFieldsValue: () => SchemaFormModel
  getFormInstance: () => unknown
  getLumaSchemas: () => SchemaFormItem[]
  handleSubmit: (model?: SchemaFormModel) => void
  handleUpdateModel: (model: SchemaFormModel) => void
  resetFields: () => void
  setFieldsValue: (values: SchemaFormModel) => void
}

export type UseVbenFormReturn = [VbenFormRegister, VbenFormApi]

export type VbenGridColumnAlign = SchemaTableAlign

export interface VbenGridColumn {
  align?: VbenGridColumnAlign
  field?: string
  formatter?: SchemaTableCellFormatter
  hidden?: boolean
  title?: string
  label?: string
  type?: string
  visible?: boolean
  width?: number | string
}

export interface VbenGridPagerConfig {
  enabled?: boolean
  pageSize?: number
  pageSizes?: number[]
}

export interface VbenGridFormOptions {
  schemas?: VbenFormSchema[]
  resetText?: string
  submitText?: string
}

export interface VbenGridToolbarConfig {
  batchDelete?: boolean
  batchDeleteText?: string
  create?: boolean
  createText?: string
  export?: boolean
  exportText?: string
  refresh?: boolean
  refreshText?: string
}

export interface VbenGridTableConfig {
  actionWidth?: number | string
  autoResize?: boolean
  showColumnSettings?: boolean
}

export interface VbenGridProxyParams extends CrudTableQueryModel {
  page: number
  pageSize: number
}

export interface VbenGridProxyResult {
  items?: SchemaTableRow[]
  list?: SchemaTableRow[]
  records?: SchemaTableRow[]
  rows?: SchemaTableRow[]
  total?: number
  totalCount?: number
  [key: string]: unknown
}

export interface VbenGridProxyConfig {
  ajax?: {
    query?: (params: VbenGridProxyParams) => Promise<VbenGridProxyResult | SchemaTableRow[]> | VbenGridProxyResult | SchemaTableRow[]
  }
  props?: {
    items?: string
    list?: string
    result?: string
    total?: string
  }
}

export interface VbenGridOptions {
  actions?: CrudTableProps['actions']
  columns?: VbenGridColumn[]
  emptyText?: string
  formOptions?: VbenGridFormOptions
  pagerConfig?: VbenGridPagerConfig | false
  proxyConfig?: VbenGridProxyConfig
  resetText?: string
  rowKey?: CrudTableProps['rowKey']
  searchText?: string
  tableConfig?: VbenGridTableConfig
  title?: string
  toolbarConfig?: VbenGridToolbarConfig
  onError?: (error: unknown) => void
}

export interface UseVbenVxeGridOptions extends VbenGridOptions {
  gridOptions?: VbenGridOptions
}

export type UseVbenVxeGridInput = MaybeRefOrGetter<UseVbenVxeGridOptions>

export interface LumaCrudTableCompatProps extends Omit<CrudTableProps, 'columns'> {
  'columns': SchemaTableColumn[]
  'page': number
  'pageSize': number
  'queryModel': CrudTableQueryModel
  'onPageChange': (payload: CrudTablePageChangePayload) => void
  'onReset': (payload: CrudTableQueryModel) => void
  'onSearch': (payload: CrudTableQueryModel) => void
  'onUpdate:page': (page: number) => void
  'onUpdate:pageSize': (pageSize: number) => void
  'onUpdate:queryModel': (model: CrudTableQueryModel) => void
}

export type VbenGridRegister = (gridInstance?: unknown) => void

export interface VbenGridApi {
  crudTableProps: ComputedRef<LumaCrudTableCompatProps>
  getGridInstance: () => unknown
  getError: () => unknown
  getLumaColumns: () => SchemaTableColumn[]
  getRows: () => SchemaTableRow[]
  getTotal: () => number
  getQueryModel: () => CrudTableQueryModel
  clearError: () => void
  handlePageChange: (payload: CrudTablePageChangePayload) => Promise<boolean>
  handleReset: (payload?: CrudTableQueryModel) => Promise<boolean>
  handleSearch: (payload?: CrudTableQueryModel) => Promise<boolean>
  reload: () => Promise<boolean>
  reset: () => Promise<boolean>
  search: (payload?: CrudTableQueryModel) => Promise<boolean>
  setLoading: (loading: boolean) => void
  setRows: (rows: SchemaTableRow[], total?: number) => void
  setQueryModel: (model: CrudTableQueryModel) => void
}

export type UseVbenVxeGridReturn = [VbenGridRegister, VbenGridApi]
