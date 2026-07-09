import type { PaginationChangePayload } from '../pagination'
import type { SchemaFormItem, SchemaFormModel } from '../schema-form'
import type { SchemaTableColumn, SchemaTableRow } from '../schema-table'

export type CrudTableQueryModel = SchemaFormModel

export type CrudTablePageChangePayload = PaginationChangePayload

export interface CrudTableSearchPayload extends SchemaFormModel {}

export interface CrudTableResetPayload extends SchemaFormModel {}

export interface CrudTableProps {
  title?: string
  description?: string
  querySchemas?: SchemaFormItem[]
  columns: SchemaTableColumn[]
  rows?: SchemaTableRow[]
  rowKey?: string | ((row: SchemaTableRow, index: number) => string | number)
  total?: number
  pageSizes?: number[]
  pagination?: boolean
  loading?: boolean
  emptyText?: string
  searchText?: string
  resetText?: string
}
