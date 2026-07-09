import type {
  CrudTableQueryModel,
  SchemaTableColumn,
  SchemaTableRow,
} from '@luma/core/components'
import type {
  UseVbenVxeGridOptions,
  VbenGridColumn,
  VbenGridOptions,
  VbenGridProxyResult,
} from '../types'
import { adaptVbenFormSchemas } from '../form'

/***********************配置归一化*********************/
export function resolveVbenGridOptions(options: UseVbenVxeGridOptions = {}): VbenGridOptions {
  return {
    ...options,
    ...(options.gridOptions ?? {}),
    formOptions: {
      ...options.formOptions,
      ...(options.gridOptions?.formOptions ?? {}),
    },
  }
}

/***********************列适配*********************/
function resolveVbenColumnField(column: VbenGridColumn): string {
  return column.field ?? ''
}

function resolveVbenColumnLabel(column: VbenGridColumn): string {
  return column.title ?? column.label ?? resolveVbenColumnField(column)
}

export function adaptVbenGridColumn(column: VbenGridColumn): SchemaTableColumn {
  return {
    align: column.align,
    field: resolveVbenColumnField(column),
    formatter: column.formatter,
    hidden: column.hidden ?? (column.visible === false),
    label: resolveVbenColumnLabel(column),
    width: column.width,
  }
}

export function adaptVbenGridColumns(columns: VbenGridColumn[] = []): SchemaTableColumn[] {
  return columns
    .filter(column => column.type !== 'checkbox' && column.type !== 'radio' && column.type !== 'seq')
    .map(column => adaptVbenGridColumn(column))
}

/***********************查询适配*********************/
export function adaptVbenGridQuerySchemas(options: VbenGridOptions) {
  return adaptVbenFormSchemas(options.formOptions?.schemas)
}

/***********************结果适配*********************/
function readRecordValue<T>(record: Record<string, unknown>, path: string | undefined): T | undefined {
  if (!path) {
    return undefined
  }

  return path.split('.').reduce<unknown>((result, key) => {
    if (result && typeof result === 'object') {
      return (result as Record<string, unknown>)[key]
    }

    return undefined
  }, record) as T | undefined
}

function toRows(value: unknown): SchemaTableRow[] | undefined {
  return Array.isArray(value) ? value as SchemaTableRow[] : undefined
}

function toTotal(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined
}

export function adaptVbenGridProxyResult(
  result: VbenGridProxyResult | SchemaTableRow[],
  options: VbenGridOptions,
): { rows: SchemaTableRow[], total: number } {
  if (Array.isArray(result)) {
    return {
      rows: result,
      total: result.length,
    }
  }

  const resultRecord = result as Record<string, unknown>
  const resultProps = options.proxyConfig?.props
  const nestedResult = readRecordValue<Record<string, unknown>>(resultRecord, resultProps?.result)
  const source = nestedResult ?? resultRecord
  const rows = readRecordValue<SchemaTableRow[]>(source, resultProps?.items)
    ?? readRecordValue<SchemaTableRow[]>(source, resultProps?.list)
    ?? toRows(source.items)
    ?? toRows(source.list)
    ?? toRows(source.records)
    ?? toRows(source.rows)
    ?? []
  const total = readRecordValue<number>(source, resultProps?.total)
    ?? toTotal(source.total)
    ?? toTotal(source.totalCount)
    ?? rows.length

  return {
    rows,
    total,
  }
}

/***********************模型工具*********************/
export function replaceVbenGridQueryModel(target: CrudTableQueryModel, source: CrudTableQueryModel): void {
  for (const key of Object.keys(target)) {
    delete target[key]
  }

  Object.assign(target, source)
}
