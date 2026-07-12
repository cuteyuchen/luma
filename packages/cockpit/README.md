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
@luma/cockpit/runtime    # 运行时组件（LumaCockpit 等）
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
