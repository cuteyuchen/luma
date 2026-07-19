# LumalChart / LumalChartPanel

来自 `@lumal/charts`。

```ts
import { LumalChart, LumalChartPanel } from '@lumal/charts'
import '@lumal/charts/style.css'
```

## LumalChartPanel

```vue
<LumalChartPanel
  v-model:view="view"
  title="访问趋势"
  :options="options"
  summary="最近七天"
  show-view-toggle
  show-export
  height="320px"
  @retry="reload"
  @export="onExport"
>
  <template #query>查询区</template>
  <template #table>表格区</template>
</LumalChartPanel>
```

| 导出 | 说明 |
| --- | --- |
| `LumalChart` | 透传 ECharts options，自适应 |
| `LumalChartPanel` | 查询 / 图表面板 / 导出 / 错误态 |
| `useChartResize` | 容器 resize |

包文档：[@lumal/charts](/packages/charts)
