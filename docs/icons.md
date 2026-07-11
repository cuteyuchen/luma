# 图标系统

`@luma/icons` 是独立图标包，可单独构建和发布。它不依赖 `@luma/core`。

## 安装

```bash
pnpm add @luma/icons vue
```

如果使用 Iconify 图标，需要应用侧安装 `@iconify/vue`。

## 基础用法

```vue
<script setup lang="ts">
import { LumaIcon } from '@luma/icons'
import '@luma/icons/style.css'
</script>

<template>
  <LumaIcon name="app:dashboard" color="#1677ff" :size="24" />
</template>
```

## 注册本地 SVG

```ts
import {
  createComponentIconDefinitions,
  createIconifyIconDefinitions,
  registerIcons,
} from '@luma/icons'

registerIcons([
  {
    key: 'app:dashboard',
    label: '控制台',
    source: 'local-svg',
    svgText: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="..."/></svg>',
  },
])

registerIcons(createComponentIconDefinitions('element-plus', {
  Edit: EditIcon,
}))

registerIcons(createIconifyIconDefinitions('mdi', [
  'home',
  'account',
]))
```

注册表为响应式 Map，选择器或其他 computed 消费者会在运行时注册新图标后自动更新。源 SVG 应保持单色并使用 `currentColor`；组件图标和 Iconify 图标只保存定义，不把对应实现变成图标包的强制依赖。

## 图标分组

```ts
import { registerIconGroups } from '@luma/icons'

registerIconGroups([
  { key: 'app', label: '应用图标', order: 1 },
])
```

## data URI

```ts
import { getIconDataUri } from '@luma/icons'

const uri = getIconDataUri('app:dashboard', '#1677ff')
```

运行时最多缓存 256 个 data URI；需要释放缓存时调用 `clearIconDataUriCache()`。

## 渐变

```ts
import { getGradientIconDataUri } from '@luma/icons'

const uri = getGradientIconDataUri('app:dashboard', {
  from: '#1677ff',
  to: '#0f766e',
  direction: 'horizontal',
})
```

## SVG 校验与合成

```ts
import { composeSvgIcons, validateMonochromeSvg } from '@luma/icons'

const validation = validateMonochromeSvg(svgText)
if (!validation.valid) {
  throw new Error(validation.reason)
}

const composed = composeSvgIcons([backgroundSvg, foregroundSvg])
```

校验会拒绝脚本、事件属性、外部 HTTP 资源和固定 `fill/stroke` 颜色；合成只接收通过校验的 SVG，并使用带序号的 `<g>` 图层组合。

## 图标选择器

```vue
<script setup lang="ts">
import { LumaIconPicker, LumaIconPickerDialog } from '@luma/icons'
import { shallowRef } from 'vue'

const value = shallowRef('app:dashboard')
</script>

<template>
  <LumaIconPicker
    v-model="value"
    group="app"
    :page-size="48"
    show-labels
    storage-key="admin:last-icon"
  />

  <LumaIconPickerDialog
    v-model="value"
    v-model:visible="dialogVisible"
    @confirm="handleConfirm"
  />
</template>
```

选择器支持搜索、分组、分页、选中态和键盘焦点；弹窗内部使用草稿值，取消不会污染外部模型，确认后才触发更新。

## Vite 静态 SVG 插件

`@luma/icons/vite` 暴露 `createStaticLocalSvgIconsPlugin`，用于构建期收集静态 SVG。具体业务图标仍应由应用侧决定，不写进图标包。
