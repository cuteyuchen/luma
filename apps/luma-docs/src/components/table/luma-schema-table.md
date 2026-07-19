# LumaSchemaTable

Schema 表格：选择列、序号、列设置、分页、字典色标、错误恢复。

```ts
import { LumaSchemaTable } from '@luma/core/components'
```

## 示例

```vue
<script setup lang="ts">
import type { SchemaTableColumn } from '@luma/core/components'
import { LumaSchemaTable } from '@luma/core/components'
import { shallowRef } from 'vue'

const page = shallowRef(1)
const pageSize = shallowRef(10)
const columns: SchemaTableColumn[] = [
  { field: 'name', label: '名称' },
  { field: 'status', label: '状态', dictionary: 'status' },
]
const rows = [{ id: 1, name: 'Luma', status: 'enabled' }]
</script>

<template>
  <LumaSchemaTable
    v-model:page="page"
    v-model:page-size="pageSize"
    :columns="columns"
    :rows="rows"
    row-key="id"
    selection
    show-index
    show-column-settings
    pagination
    :total="1"
  />
</template>
```

## 能力摘要

- `selection` → `selection-change(rows, rowKeys)`
- `showColumnSettings` + `columnSettings.storageKey` 持久化
- `pagination` + `v-model:page` / `page-size`
- `table-${field}` / `actions` 插槽
- `error` / `retry` 错误态

详情：[Core API](/reference/core-api)
