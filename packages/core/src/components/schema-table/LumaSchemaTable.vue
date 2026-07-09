<script setup lang="ts">
import type { NormalizedSchemaTableColumn, SchemaTableColumn, SchemaTableRow } from './types'
import { computed, useTemplateRef } from 'vue'
import { normalizeSchemaTableColumns } from './normalize'

/***********************属性定义*********************/
const props = withDefaults(defineProps<{
  columns: SchemaTableColumn[]
  rows?: SchemaTableRow[]
  rowKey?: string | ((row: SchemaTableRow, index: number) => string | number)
  emptyText?: string
}>(), {
  rows: () => [],
  emptyText: '暂无数据',
})

/***********************模板引用*********************/
const tableRef = useTemplateRef<HTMLTableElement>('tableRef')

/***********************列状态*********************/
const normalizedColumns = computed(() => normalizeSchemaTableColumns(props.columns))

const renderableColumns = computed(() => normalizedColumns.value.filter(column => column.renderable))

/***********************表格取值*********************/
function resolveRowKey(row: SchemaTableRow, index: number): string | number {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row, index)
  }

  if (typeof props.rowKey === 'string') {
    const value = row[props.rowKey]
    return typeof value === 'number' || typeof value === 'string' ? value : index
  }

  return index
}

function getColumnStyle(column: NormalizedSchemaTableColumn): Record<string, string> {
  if (column.width === undefined) {
    return {}
  }

  return {
    width: typeof column.width === 'number' ? `${column.width}px` : column.width,
  }
}

function formatCellText(row: SchemaTableRow, column: NormalizedSchemaTableColumn, index: number): string {
  const rawValue = row[column.field]
  const formattedValue = column.formatter?.(rawValue, row, index) ?? rawValue

  if (formattedValue === undefined || formattedValue === null || formattedValue === '') {
    return column.emptyText
  }

  return String(formattedValue)
}

/***********************公开方法*********************/
defineExpose({
  getTableElement: () => tableRef.value,
})
</script>

<template>
  <div class="luma-schema-table">
    <table ref="tableRef" class="luma-schema-table__table">
      <thead class="luma-schema-table__head">
        <tr class="luma-schema-table__row">
          <th
            v-for="column in renderableColumns"
            :key="column.field"
            class="luma-schema-table__cell luma-schema-table__cell--head"
            :class="`luma-schema-table__cell--${column.align}`"
            :style="getColumnStyle(column)"
            :data-field="column.field"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>

      <tbody class="luma-schema-table__body">
        <tr
          v-for="(row, rowIndex) in rows"
          :key="resolveRowKey(row, rowIndex)"
          class="luma-schema-table__row"
        >
          <td
            v-for="column in renderableColumns"
            :key="column.field"
            class="luma-schema-table__cell"
            :class="`luma-schema-table__cell--${column.align}`"
            :data-field="column.field"
          >
            {{ formatCellText(row, column, rowIndex) }}
          </td>
        </tr>

        <tr v-if="rows.length === 0" class="luma-schema-table__row">
          <td class="luma-schema-table__empty" :colspan="renderableColumns.length || 1">
            {{ emptyText }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.luma-schema-table {
  width: 100%;
  overflow-x: auto;
}

.luma-schema-table__table {
  width: 100%;
  border-collapse: collapse;
  color: #111827;
  font-size: 14px;
}

.luma-schema-table__cell {
  padding: 10px 12px;
  border-bottom: 1px solid #e5e7eb;
  line-height: 1.5;
  white-space: nowrap;
}

.luma-schema-table__cell--head {
  color: #374151;
  background: #f9fafb;
  font-weight: 600;
}

.luma-schema-table__cell--left {
  text-align: left;
}

.luma-schema-table__cell--center {
  text-align: center;
}

.luma-schema-table__cell--right {
  text-align: right;
}

.luma-schema-table__empty {
  padding: 20px 12px;
  color: #6b7280;
  text-align: center;
}
</style>
