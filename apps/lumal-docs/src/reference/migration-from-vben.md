# 从 Vben 迁移

Lumal 的 Vben 兼容层用于降低迁移成本，不追求完整复刻 Vben Admin。兼容 API 放在 `@lumal/vben-compat`，不会进入 `@lumal/core`。

## 当前已支持

### `useVbenForm`

当前支持常见表单 schema 转换到 `LumalSchemaForm`：

- `fieldName` / `field` 转为 `field`。
- `Input`、`Input.Password` 转为 `input`。
- `Input.TextArea`、`Textarea` 转为 `textarea`。
- `Select` 转为 `select`。
- `InputNumber` 转为 `number`。
- `Switch` 转为 `switch`。
- `DatePicker` 按 `componentProps.type` 转为 `date`、`datetime` 或 `daterange`。
- `DatePicker.RangePicker` 转为 `daterange`。
- `RadioGroup`、`CheckboxGroup` 转为 `radio`、`checkbox`。
- `TreeSelect`、`Upload` 转为 `tree-select`、`upload`。
- `Hidden` 转为 `hidden`。
- `componentProps.placeholder` 转为 `placeholder`。
- `componentProps.options` 转为 `options`。
- `required` 或 `rules[].required` 转为 `required`。
- `show: false`、`ifShow: false`、`hidden: true` 转为隐藏字段。

`useVbenForm` 返回 `[register, formApi]`，其中 `formApi` 提供：

- `schemaFormProps`：可直接绑定给 `LumalSchemaForm` 的 props。
- `getFieldsValue()`：获取当前模型。
- `setFieldsValue(values)`：合并设置模型。
- `resetFields()`：恢复初始模型和 schema 默认值。
- `getLumalSchemas()`：获取转换后的 Lumal schema。
- `getFormInstance()`：获取通过 `register` 绑定的表单实例。

### `useVbenVxeGrid`

当前支持常见 grid 配置转换到 `LumalCrudTable`：

- `gridOptions.columns` 转为 Lumal 表格 columns。
- `field` 转为 `field`。
- `title` / `label` 转为 `label`。
- `width`、`align`、`formatter` 透传。
- `hidden: true` 或 `visible: false` 转为隐藏列。
- `type: 'checkbox'` 转为 Lumal selection；`type: 'radio'`、`type: 'seq'` 等未对应到 Lumal 公共模型的辅助列会跳过。
- `gridOptions.formOptions.schemas` 复用 `useVbenForm` 的 schema 适配规则。
- `gridOptions.pagerConfig.pageSize` / `pageSizes` 转为分页配置。
- `gridOptions.proxyConfig.ajax.query` 用于加载列表数据。
- `proxyConfig.props.result`、`items` / `list`、`total` 可用于适配嵌套接口结果。
- `toolbarConfig` 转为 CRUD toolbar，`actions` 转为行级操作，`tableConfig` 转为列设置和自动 resize 等表格配置。
- total 支持有限数字字符串归一化；其他公司异常字段仍应在应用 adapter 处理。

`useVbenVxeGrid` 返回 `[register, gridApi]`，其中 `gridApi` 提供：

- `crudTableProps`：可直接绑定给 `LumalCrudTable` 的 props。
- `getLumalColumns()`：获取转换后的 Lumal columns。
- `getRows()` / `setRows(rows, total)`：读取或设置表格数据。
- `getTotal()`：读取总数。
- `getQueryModel()` / `setQueryModel(model)`：读取或设置查询模型。
- `search(payload)` / `reload()` / `reset()`：触发查询、刷新和重置，并返回 `Promise<boolean>` 供调用方等待结果。
- `handleSearch(payload)` / `handleReset(payload)` / `handlePageChange(payload)`：用于绑定 LumalCrudTable 事件。
- `getGridInstance()`：获取通过 `register` 绑定的表格实例。
- `getError()` / `clearError()`：读取和清理最近一次加载错误；`gridOptions.onError` 可统一接收失败。

## 最小迁移示例

旧页面可以先保留 Vben 风格 schema，再把兼容层产出的 props 绑定到 Lumal 原生组件：

```vue
<script setup lang="ts">
import { LumalCrudTable, LumalSchemaForm } from '@lumal/core/components'
import { useVbenForm, useVbenVxeGrid } from '@lumal/vben-compat'

const [, formApi] = useVbenForm({
  schemas: [
    { component: 'Input', fieldName: 'keyword', label: '关键词' },
  ],
})

const [, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      { field: 'name', title: '名称' },
    ],
    formOptions: {
      schemas: [
        { component: 'Input', fieldName: 'keyword', label: '关键词' },
      ],
    },
  },
})
</script>

<template>
  <LumalSchemaForm v-bind="formApi.schemaFormProps.value" />
  <LumalCrudTable v-bind="gridApi.crudTableProps.value" />
</template>
```

完整可构建示例见 `apps/vben-compat-demo`，验证命令：

```bash
pnpm compat:build
```

## 当前未支持

- Vben 表单的完整校验规则映射。
- 动态函数式 `ifShow`、`dynamicDisabled` 等高级运行时能力。
- Vben 表单布局、栅格和复杂插槽协议。
- VXE 原生渲染、高级编辑、虚拟滚动和复杂 toolbar 插槽协议。

## 迁移原则

优先迁移到 Lumal 原生 schema；兼容层只覆盖高频写法。遇到高级 Vben 能力时，应先判断是否真的需要保留，再决定是否在兼容层补子集能力。
