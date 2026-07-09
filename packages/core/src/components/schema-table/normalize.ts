import type { NormalizedSchemaTableColumn, SchemaTableColumn } from './types'

/***********************列归一化*********************/
export function normalizeSchemaTableColumns(columns: SchemaTableColumn[] = []): NormalizedSchemaTableColumn[] {
  return columns
    .map(column => ({
      ...column,
      field: column.field.trim(),
    }))
    .filter(column => column.field)
    .map(column => ({
      ...column,
      align: column.align ?? 'left',
      emptyText: column.emptyText ?? '-',
      renderable: !column.hidden,
    }))
}
