# LumaChart / LumaChartPanel

来自 `@luma/charts`。

```ts
import { LumaChart, LumaChartPanel } from '@luma/charts'
import '@luma/charts/style.css'
```

## LumaChartPanel

```vue
<LumaChartPanel
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
</LumaChartPanel>
```

| 导出 | 说明 |
| --- | --- |
| `LumaChart` | 透传 ECharts options，自适应 |
| `LumaChartPanel` | 查询 / 图表面板 / 导出 / 错误态 |
| `useChartResize` | 容器 resize |

包文档：[@luma/charts](/packages/charts)
