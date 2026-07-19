# @lumal/charts

Lumal 可选图表包，基于 ECharts 与 vue-echarts 封装轻量图表组件。ECharts 作为 peer dependency，不进入 `@lumal/core` 默认依赖。

## 安装

```bash
pnpm add @lumal/charts echarts vue-echarts vue
```

## 用法

```ts
import { LumalChart, LumalChartPanel, useChartResize } from '@lumal/charts'
import '@lumal/charts/style.css'
```

```vue
<LumalChartPanel
  v-model:view="view"
  title="访问趋势"
  :options="options"
  :error="error"
  summary="最近七天访问趋势"
  show-view-toggle
  show-export
  height="320px"
  @retry="reload"
  @export="handleExport"
>
  <template #query>查询条件</template>
  <template #table>可访问的数据表格</template>
</LumalChartPanel>
```

## 导出

- `LumalChart`：基础图表组件，透传 ECharts `options`，容器自适应，并默认响应 reduced-motion。
- `LumalChartPanel`：支持查询区、图表/表格切换、导出、重试、loading/empty/error 和无障碍摘要的工作流面板。
- `useChartResize`：监听容器尺寸变化并触发图表 resize。
- `resolveChartPanelStyle`：图表区/表格区宽度到 CSS 变量的映射。
