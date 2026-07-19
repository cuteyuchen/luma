# @luma/icons-vue

`@luma/icons` 的 Vue 3 组件与响应式适配层。

| 项 | 值 |
| --- | --- |
| 包名 | `@luma/icons-vue` |
| 本地路径 | `packages/icons-vue` |
| 文档（本地占位） | http://localhost:5173/packages/icons-vue |
| 正式地址（上线后） | `https://www.npmjs.com/package/@luma/icons-vue` |

## 安装

```bash
pnpm add @luma/icons @luma/icons-vue vue @iconify/vue
```

## 公开入口

| 入口 | 用途 |
| --- | --- |
| `@luma/icons-vue` | `LumaIcon`、选择器、`useIconRegistry` |
| `@luma/icons-vue/style.css` | 组件样式 |

## 基础用法

```vue
<script setup lang="ts">
import { LumaIcon } from '@luma/icons-vue'
import '@luma/icons-vue/style.css'
</script>

<template>
  <LumaIcon name="luma:settings" color="#1677ff" :size="20" />
</template>
```

## 与 createLumaAdmin 联用

在 `createLumaAdmin({ icons: { localSvg: [...] } })` 中注册本地 SVG 后，可在菜单 `icon` 字段与 `LumaIcon` 中直接使用对应 `key`。

## 导出组件

- `LumaIcon`
- `LumaIconPicker`
- `LumaIconPickerDialog`
- `useIconRegistry`

SVG 改色、合成、Data URI 等纯 TS 能力在 [@luma/icons](./icons)，本包不重复实现。

## Peer

- `vue`
- `@iconify/vue`
