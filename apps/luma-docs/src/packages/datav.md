# @luma/datav

面向驾驶舱的 Vue 3 DataV 组件包。以 DataV 2.10.0（MIT）为基准重构，支持 DataV `config` 与现代 props 双套 API。

| 项 | 值 |
| --- | --- |
| 包名 | `@luma/datav` |
| 本地路径 | `packages/datav` |
| 文档（本地占位） | http://localhost:5173/packages/datav |
| 正式地址（上线后） | `https://www.npmjs.com/package/@luma/datav` |
| 示例 | [DataV 示例](/reference/datav-examples)、`apps/luma-datav-guide` |

## 安装

```bash
pnpm add @luma/datav vue echarts
```

## 公开入口

根入口与按需子入口（节选）：

| 入口 | 组件 |
| --- | --- |
| `@luma/datav` | 全量 + 插件式 `use` |
| `@luma/datav/border-box` | `LumaBorderBox` |
| `@luma/datav/decoration` | `LumaDecoration` |
| `@luma/datav/digital-flop` | `LumaDigitalFlop` |
| `@luma/datav/scroll-board` | `LumaScrollBoard` |
| `@luma/datav/flyline-chart` | `LumaFlylineChart` |
| `@luma/datav/charts` | `LumaCharts` |
| … | 见 `package.json` `exports` |
| `@luma/datav/style.css` | 样式 |

## 全量注册

```ts
import { createApp } from 'vue'
import LumaDatav from '@luma/datav'
import '@luma/datav/style.css'

createApp(App).use(LumaDatav).mount('#app')
```

## 按需导入

```ts
import LumaBorderBox from '@luma/datav/border-box'
import LumaFlylineChart from '@luma/datav/flyline-chart'
import '@luma/datav/style.css'
```

## 两套 API

DataV 原生配置：

```vue
<LumaDigitalFlop :config="{ number: [1286], content: '{nt} 台', toFixed: 0 }" />
<LumaScrollBoard :config="{ header: ['区域', '数量'], data: [['甲区', 20]], rowNum: 5 }" />
```

现代 props（优先级：显式 props > `config` > 上游默认）：

```vue
<LumaBorderBox :variant="8" :duration="3000">
  <LumaDigitalFlop :value="1286" suffix=" 台" />
</LumaBorderBox>
```

滚动表中的 HTML 字符串按**普通文本**渲染，不恢复上游 `v-html`。

## DataV 原生 Charts（`LumaCharts`）

```vue
<LumaCharts
  :config="{
    xAxis: { data: ['一', '二', '三'] },
    yAxis: { data: 'value' },
    series: [{ type: 'line', data: [120, 200, 150] }],
  }"
/>
```

`config` 由 DataV 使用的 `@jiaminghi/charts` 直接解释。既有 ECharts 调用继续通过 `option` 扩展兼容：

```vue
<LumaCharts
  :option="option"
  theme="dark"
  :init-options="{ renderer: 'canvas', devicePixelRatio: 2 }"
  :set-option-options="{ notMerge: false, lazyUpdate: true }"
  :events="{ legendselectchanged: handleLegendChange }"
  @click="handleChartClick"
/>
```

`autoResize` 对两种模式生效；`theme`、事件、loading 和 ECharts 实例方法只在 `option` 模式生效。

## 组件映射（DataV → Luma）

| DataV | Luma |
| --- | --- |
| borderBox1–13 | `LumaBorderBox variant=1..13` |
| decoration1–12 | `LumaDecoration variant=1..12` |
| fullScreenContainer | `LumaFullScreenContainer` |
| loading | `LumaLoading` |
| charts | `LumaCharts` |
| activeRingChart | `LumaActiveRingChart` |
| capsuleChart | `LumaCapsuleChart` |
| waterLevelPond | `LumaWaterLevelPond` |
| percentPond | `LumaPercentPond` |
| digitalFlop | `LumaDigitalFlop` |
| flylineChart / Enhanced | `LumaFlylineChart` / `LumaFlylineChartEnhanced` |
| conicalColumnChart | `LumaConicalColumnChart` |
| scrollBoard | `LumaScrollBoard` |
| scrollRankingBoard | `LumaScrollRankingBoard` |

## 主题

现代 API 可通过 `--luma-datav-*` 语义变量调整。与 `@luma/cockpit` 联用时，在应用层映射到 `--luma-cockpit-*`。

## 边界

- 仅 peer：`vue`、`echarts`
- **不**依赖 `@luma/core` / charts / cockpit
- 不得引入业务接口、状态码或字段映射
- 版权说明见包内 `THIRD_PARTY_NOTICES.md`
