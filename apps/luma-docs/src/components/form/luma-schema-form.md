# LumaSchemaForm

Schema 驱动表单，支持 create / edit / view 模式与字典联动。

```ts
import { LumaSchemaForm } from '@luma/core/components'
import type { SchemaFormItem, SchemaFormModel } from '@luma/core/components'
```

## 示例

```vue
<script setup lang="ts">
import type { SchemaFormItem, SchemaFormModel } from '@luma/core/components'
import { LumaSchemaForm } from '@luma/core/components'
import { shallowRef } from 'vue'

const model = shallowRef<SchemaFormModel<{ name: string, status: string }>>({})
const schemas: SchemaFormItem[] = [
  {
    field: 'name',
    label: '名称',
    component: 'input',
    rules: [{ required: true, message: '请输入名称' }],
  },
  { field: 'status', label: '状态', dictionary: 'status' },
]
</script>

<template>
  <LumaSchemaForm
    v-model="model"
    :columns="2"
    label-width="92px"
    :schemas="schemas"
    show-actions
  />
</template>
```

## 内置控件

`input`、`textarea`、`select`、`number`、`switch`、`date`、`datetime`、`daterange`、`radio`、`checkbox`、`tree-select`、`upload`、`hidden`。

## 字段配置要点

| 字段 | 说明 |
| --- | --- |
| `field` / `label` / `component` | 基础 |
| `dictionary` | 字典 options |
| `rules` | 校验 |
| `hidden` / `disabled` / `readonly` | 布尔或函数 |
| `authority` / `readonlyAuthority` | 权限 |
| `formatter` | view 模式展示 |
| `componentProps` | 透传 Element Plus |
| `description` / `help` | 控件下方说明 |

## 插槽

- `field-${field}`：整字段接管
- `prefix-${field}` / `suffix-${field}`

## 模式

- `create` / `edit`：可编辑
- `view`：文本语义展示，而非禁用输入框堆叠

更多：[Core API · Schema Form](/reference/core-api)
