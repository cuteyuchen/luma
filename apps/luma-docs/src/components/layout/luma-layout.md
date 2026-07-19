# LumaLayout

后台主布局：顶栏、侧栏、混合导航、标签、面包屑、全局搜索、移动抽屉。

**导入**

```ts
import { LumaLayout, LumaRouterView } from '@luma/core/layout'
```

## 基础用法

```vue
<script setup lang="ts">
import { LumaLayout, LumaRouterView } from '@luma/core/layout'
</script>

<template>
  <LumaLayout
    title="Luma Admin"
    :menus="menus"
    :preferences="preferences"
    route-driven
    tab-storage-key="luma-admin:tabs"
  >
    <template #headerActions>
      <!-- 用户菜单等 -->
    </template>
    <LumaRouterView />
  </LumaLayout>
</template>
```

## 常用 Props

| Prop | 说明 |
| --- | --- |
| `title` | 顶栏标题 |
| `menus` | 菜单树 |
| `preferences` | 布局 / 标签 / 主题相关偏好 |
| `routeDriven` | 按路由驱动标签 |
| `fixedTabs` | 固定标签（不可关闭） |
| `tabStorageKey` | 标签会话快照 key |
| `tabMaxCount` | 最大标签数，0 不限制 |
| `globalSearchEnabled` | 全局搜索 |

## 插槽

- 默认：内容区（通常放 `LumaRouterView`）
- `headerActions` / 顶栏相关插槽：应用自定义操作

## 相关

- [布局与标签](/guide/in-depth/layout)
- [偏好与配置](/guide/essentials/settings)
- [@luma/core](/packages/core)
