# LumaCrudTable

查询 + 表格 + 分页 + 增删改查组合。

```ts
import { LumaCrudTable } from '@luma/core/components'
import type { CrudDataSource, CrudTableColumn } from '@luma/core/components'
```

## 数据源模式

```vue
<script setup lang="ts">
import type { CrudDataSource, CrudTableColumn } from '@luma/core/components'
import { LumaCrudTable } from '@luma/core/components'

const columns: CrudTableColumn[] = [
  { field: 'name', label: '名称', required: true },
  { field: 'status', label: '状态', dictionary: 'status' },
]

const dataSource: CrudDataSource = {
  fetch: async () => ({ items: [], total: 0 }),
  create: async model => save(model),
  update: async model => update(model),
  remove: async row => remove(row.id),
}
</script>

<template>
  <LumaCrudTable
    title="项目列表"
    :data-source="dataSource"
    :query="{ collapsible: true, schemas: [{ field: 'keyword', label: '关键词', component: 'input' }] }"
    :table="{ columns, rowKey: 'id', selection: true, showColumnSettings: true }"
    :toolbar="{ export: true }"
  />
</template>
```

## 模式

| 模式 | 说明 |
| --- | --- |
| 受控 | 传入 `rows` / `total`，外部管数据 |
| 数据源 | `dataSource.fetch` 等，内部 loading / error |

标准 fetch 结果：`{ items, total }`；否则提供 `parseResponse`。

## 注意

- 不含 `LumaPage` 壳，页面自行包裹
- 未配 `formSchemas` 时从 `columns` 派生表单
- `editor.type`: `dialog` | `drawer`

完整说明：[Core API](/reference/core-api)
