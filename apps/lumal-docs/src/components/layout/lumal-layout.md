# LumalLayout

后台主布局：顶栏、侧栏、混合导航、标签、面包屑、全局搜索、移动抽屉。

**导入**

```ts
import { LumalLayout, LumalRouterView } from '@lumal/core/layout'
```

## 基础用法

```vue
<script setup lang="ts">
import { LumalLayout, LumalRouterView } from '@lumal/core/layout'
</script>

<template>
  <LumalLayout
    title="Lumal Admin"
    :menus="menus"
    :preferences="preferences"
    route-driven
    tab-storage-key="lumal-admin:tabs"
  >
    <template #headerActions>
      <!-- 用户菜单等 -->
    </template>
    <LumalRouterView />
  </LumalLayout>
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

- 默认：内容区（通常放 `LumalRouterView`）
- `headerActions` / 顶栏相关插槽：应用自定义操作

## 相关

- [布局与标签](/guide/in-depth/layout)
- [偏好与配置](/guide/essentials/settings)
- [@lumal/core](/packages/core)
