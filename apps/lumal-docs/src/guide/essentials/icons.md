# 图标

图标拆为两包：

| 包 | 职责 |
| --- | --- |
| `@lumal/icons` | 注册表、SVG 改色 / 合成、Vite 插件 |
| `@lumal/icons-vue` | `LumalIcon`、选择器、`useIconRegistry` |

## 注册

```ts
import { registerIcons, createIconifyIconDefinitions } from '@lumal/icons'

registerIcons([
  {
    key: 'app:dashboard',
    label: '控制台',
    source: 'local-svg',
    svgText: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="..."/></svg>',
  },
])

registerIcons(createIconifyIconDefinitions('mdi', ['home', 'account']))
```

或在 `createLumalAdmin({ icons: { localSvg: [...] } })` 中注册。

## 使用

```vue
<script setup lang="ts">
import { LumalIcon } from '@lumal/icons-vue'
import '@lumal/icons-vue/style.css'
</script>

<template>
  <LumalIcon name="app:dashboard" :size="20" color="#1677ff" />
</template>
```

完整说明：[图标系统](/reference/icons)、[包：icons](/packages/icons)、[icons-vue](/packages/icons-vue)。
