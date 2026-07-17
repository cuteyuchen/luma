# @luma/icons-vue

`@luma/icons` 的 Vue 3 组件与响应式适配层，提供 `LumaIcon`、`LumaIconPicker`、`LumaIconPickerDialog` 和 `useIconRegistry`。

```vue
<script setup lang="ts">
import { LumaIcon } from '@luma/icons-vue'
import '@luma/icons-vue/style.css'
</script>

<template>
  <LumaIcon name="luma:settings" color="#1677ff" :size="20" />
</template>
```

SVG 改色、渐变、合成、Data URI 和注册表等纯 TypeScript 能力由 `@luma/icons` 提供。
