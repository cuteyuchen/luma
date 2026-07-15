# @luma/cockpit

Luma 通用驾驶舱编排框架。提供驾驶舱骨架、布局运行时、模块编排设计器、组件注册机制与通用消息通道。

本包不内置任何地图引擎、图表引擎、业务模块或行业术语。中央组件、业务模块、分类、页面、数据请求、权限和持久化实现全部由应用提供。

## 依赖方向

```text
@luma/icons → @luma/core → @luma/cockpit → apps
```

`@luma/core` 不能反向依赖 `@luma/cockpit`；`@luma/cockpit` 不依赖 `@luma/charts`、ECharts、OpenLayers、Cesium、Mapbox、Leaflet 等可视化或地图运行时。

## 公开入口

```text
@luma/cockpit            # 类型、注册表、消息与运行时公共 API
@luma/cockpit/runtime    # 运行时组件（LumaCockpit、LumaCockpitCard 等）
@luma/cockpit/designer   # 配置设计器（LumaCockpitDesigner）
@luma/cockpit/registry   # createCockpitRegistry
@luma/cockpit/style.css  # 基础样式
```

`runtime` 与 `designer` 为独立构建入口，只读驾驶舱应用可只加载 `runtime`。

## 基本用法

```ts
import { createCockpitRegistry } from '@luma/cockpit/registry'

const registry = createCockpitRegistry()
registry.registerCenter({ type: 'app-center', label: '中央视图', component: () => import('./Center.vue') })
registry.registerWidget({ type: 'app-widget', label: '业务模块', component: () => import('./Widget.vue') })
```

```vue
<script setup lang="ts">
import { LumaCockpit } from '@luma/cockpit/runtime'
import '@luma/cockpit/style.css'
</script>

<template>
  <LumaCockpit :config="config" :registry="registry" />
</template>
```

应用通过 CSS 变量、class 和插槽完成品牌定制，不修改包内组件。

## 公共 Card

`LumaCockpitCard`、`CockpitCardTab`、`CockpitCardProps` 和 `CockpitCardComponent` 同时从 `@luma/cockpit` 与 `@luma/cockpit/runtime` 导出。`LumaCockpit` 默认使用 `LumaCockpitCard`；应用需要完全替换外观或结构时，可传入兼容组件：

```vue
<script setup lang="ts">
import type { CockpitCardComponent } from '@luma/cockpit/runtime'
import { LumaCockpit } from '@luma/cockpit/runtime'
import AppCockpitCard from './AppCockpitCard.vue'

const cardComponent: CockpitCardComponent = AppCockpitCard
</script>

<template>
  <LumaCockpit
    :config="config"
    :registry="registry"
    :card-component="cardComponent"
  />
</template>
```

Card 替换组件须遵守以下契约：

- props：`title?: string`、`widget?: CockpitWidgetInstance`、`tabs?: CockpitCardTab[]`、`activeTabId?: string`，其中 Tab 项为 `{ id, title, widget }`。
- emit：`update:activeTabId`，参数为新的 Tab id。
- slots：默认插槽 `{ activeTabId }`；`title` 插槽 `{ title, widget }`；`tab` 插槽 `{ tab, active }`。
- 多个 Tab 在标题栏内切换；单个 Tab 退化为普通标题，不渲染无意义的 Tab 控件。
- 标题由运行时按 `widget.title → registry.label → widget.type` 回退。既有 `widget-title` 插槽同时映射到普通标题和 Tab 标题。

默认组件使用 `.luma-cockpit-card`、`__header`、`__title`、`__tablist`、`__tab` 和 `__body` 作为样式入口。Card 只负责外框、标题、Tab 和统一内容间距；业务数据的 loading、empty、error 状态仍由 Widget 自己处理。
