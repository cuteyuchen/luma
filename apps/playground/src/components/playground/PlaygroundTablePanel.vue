<script setup lang="ts">
import type {
  PaginationChangePayload,
  SchemaTableColumn,
  SchemaTableRow,
} from '@luma/core/components'
import { LumaPagination, LumaSchemaTable } from '@luma/core/components'

/***********************属性定义*********************/
defineProps<{
  columns: SchemaTableColumn[]
  rows: SchemaTableRow[]
  message: string
}>()

const emit = defineEmits<{
  change: [payload: PaginationChangePayload]
}>()

const page = defineModel<number>('page', { default: 1 })
const pageSize = defineModel<number>('pageSize', { default: 10 })

/***********************事件处理*********************/
function handleChange(payload: PaginationChangePayload): void {
  emit('change', payload)
}
</script>

<template>
  <div class="playground-table-panel">
    <LumaSchemaTable
      :columns="columns"
      :rows="rows"
      row-key="id"
    />

    <div class="playground-table-panel__footer">
      <span class="playground-table-panel__message">
        {{ message }}
      </span>

      <LumaPagination
        v-model:page="page"
        v-model:page-size="pageSize"
        :total="42"
        :page-sizes="[10, 20]"
        @change="handleChange"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.playground-table-panel {
  display: grid;
  gap: 16px;
}

.playground-table-panel__footer {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
}

.playground-table-panel__message {
  min-width: 0;
  color: #64748b;
  font-size: 13px;
}

@media (max-width: 760px) {
  .playground-table-panel__footer {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
