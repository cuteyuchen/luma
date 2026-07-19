# @lumal/icons-vue

`@lumal/icons` 的 Vue 3 组件与响应式适配层，提供 `LumalIcon`、`LumalIconPicker`、`LumalIconPickerDialog` 和 `useIconRegistry`。

```vue
<script setup lang="ts">
import { LumalIcon } from '@lumal/icons-vue'
import '@lumal/icons-vue/style.css'
</script>

<template>
  <LumalIcon name="lumal:settings" color="#1677ff" :size="20" />
</template>
```

SVG 改色、渐变、合成、Data URI 和注册表等纯 TypeScript 能力由 `@lumal/icons` 提供。
