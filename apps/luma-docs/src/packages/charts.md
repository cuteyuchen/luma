# @luma/charts

可选 ECharts 图表包。ECharts 不进入 `@luma/core` 默认依赖。

| 项 | 值 |
| --- | --- |
| 包名 | `@luma/charts` |
| 本地路径 | `packages/charts` |
| 文档（本地占位） | http://localhost:5173/packages/charts |
| 正式地址（上线后） | `https://www.npmjs.com/package/@luma/charts` |

## 安装

```bash
pnpm add @luma/charts echarts vue-echarts vue
```

## 公开入口

| 入口 | 用途 |
| --- | --- |
| `@luma/charts` | `LumaChart`、`LumaChartPanel`、`useChartResize` 等 |
| `@luma/charts/style.css` | 样式 |

## 用法

```ts
import { LumaChart, LumaChartPanel, useChartResize } from '@luma/charts'
import '@luma/charts/style.css'
```

```vue
<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import { LumaChartPanel } from '@luma/charts'
import { shallowRef } from 'vue'
import '@luma/charts/style.css'

const view = shallowRef<'chart' | 'table'>('chart')
const options = shallowRef<EChartsOption>({
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed'] },
  yAxis: { type: 'value' },
  series: [{ type: 'line', data: [120, 200, 150] }],
})
</script>

<template>
  <LumaChartPanel
    v-model:view="view"
    title="访问趋势"
    :options="options"
    summary="最近七天访问趋势"
    show-view-toggle
    show-export
    height="320px"
    @retry="reload"
    @export="handleExport"
  >
    <template #query>
      查询条件
    </template>
    <template #table>
      可访问的数据表格
    </template>
  </LumaChartPanel>
</template>
```

## 导出说明

| 导出 | 说明 |
| --- | --- |
| `LumaChart` | 透传 ECharts `options`，容器自适应，响应 `prefers-reduced-motion` |
| `LumaChartPanel` | 查询区、图表/表格切换、导出、重试、loading/empty/error、无障碍摘要 |
| `useChartResize` | 监听容器尺寸并 `resize` |
| `resolveChartPanelStyle` | 图表区/表格区宽度 → CSS 变量 |

## Peer

- `vue`
- `echarts`
- `vue-echarts`

## 与 DataV 区别

- `@luma/charts`：后台场景的图表工作流面板
- `@luma/datav` 的 `LumaCharts`：大屏场景 DataV 原生 Charts，并保留 ECharts 扩展，见 [datav](./datav)
