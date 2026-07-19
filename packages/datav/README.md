# @luma/datav

面向 Luma 驾驶舱的 Vue 3 DataV 组件包。当前版本以 DataV 2.10.0（MIT）为基准，完整重构其 38 个组件的默认几何、动效和 `config` 协议，同时提供更明确的现代 props API。

## 安装

```bash
pnpm add @luma/datav vue echarts
```

```ts
import { createApp } from 'vue'
import LumaDatav from '@luma/datav'
import '@luma/datav/style.css'

createApp(App).use(LumaDatav).mount('#app')
```

组件支持根入口和独立子入口按需导入：

```ts
import LumaBorderBox from '@luma/datav/border-box'
import LumaFlylineChart from '@luma/datav/flyline-chart'
import '@luma/datav/style.css'
```

### DataV 原生 Charts 与 ECharts 扩展

`config` 直接交给 DataV 2.10.0 使用的 `@jiaminghi/charts` Canvas 运行时：

```vue
<LumaCharts :config="{ xAxis: { data: ['一', '二'] }, yAxis: { data: 'value' }, series: [{ type: 'line', data: [10, 20] }] }" />
```

为兼容既有项目，未传 `config` 时仍可用 ECharts 原生 `option`：

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

`autoResize` 对两种运行时都有效；`theme`、事件、loading 与 ECharts 实例方法仅属于 `option` 扩展模式。组件 ref 提供 `getInstance()`、`getNativeInstance()`、`setConfig()`、`setOption()` 与 `resize()`。

## 两套 API

DataV 原生配置可以直接迁移：

```vue
<LumaDigitalFlop :config="{ number: [1286], content: '{nt} 台', toFixed: 0 }" />
<LumaScrollBoard :config="{ header: ['区域', '数量'], data: [['甲区', 20]], rowNum: 5 }" />
```

也可以使用类型更明确的现代 props：

```vue
<LumaBorderBox :variant="8" :duration="3000">
  <LumaDigitalFlop :value="1286" suffix=" 台" />
</LumaBorderBox>
```

同一字段同时出现时，优先级为：显式现代 props > DataV `config` > DataV 上游默认值。为了避免注入风险，滚动表中的 HTML 字符串按普通文本渲染，不恢复上游 `v-html`；除此之外保留上游公开视觉、几何、动画和事件语义。

## 实现说明

- BorderBox、Decoration、Loading、PercentPond、Flyline 等使用响应式 SVG、CSS 与 SMIL 重构。
- `LumaWaterLevelPond` 使用响应式 SVG 波浪、裁剪与渐变实现，不依赖 Canvas 运行时。
- `LumaCharts` 的 `config` 使用 DataV 官方 `@jiaminghi/charts`；既有 `option` API 保留为 ECharts 扩展，两套配置不互转。
- `LumaActiveRingChart` 在 ECharts 兼容层中模拟每个数据项独立半径，保持上游固定线宽与切换几何。
- 连续动画支持页面隐藏、离开视口、悬停、键盘焦点和 `prefers-reduced-motion` 暂停。
- ResizeObserver 通过 `requestAnimationFrame` 合并；数字动画和定时器会在更新或卸载时立即清理。
- 滚动组件使用循环窗口索引，不复制整份数据；现代单行滚动最多渲染 `visibleRows + 1` 行。

## 38 个 DataV 组件映射

| DataV 2.10.0 | @luma/datav |
| --- | --- |
| borderBox1 | `LumaBorderBox variant=1` |
| borderBox2 | `LumaBorderBox variant=2` |
| borderBox3 | `LumaBorderBox variant=3` |
| borderBox4 | `LumaBorderBox variant=4` |
| borderBox5 | `LumaBorderBox variant=5` |
| borderBox6 | `LumaBorderBox variant=6` |
| borderBox7 | `LumaBorderBox variant=7` |
| borderBox8 | `LumaBorderBox variant=8` |
| borderBox9 | `LumaBorderBox variant=9` |
| borderBox10 | `LumaBorderBox variant=10` |
| borderBox11 | `LumaBorderBox variant=11` |
| borderBox12 | `LumaBorderBox variant=12` |
| borderBox13 | `LumaBorderBox variant=13` |
| decoration1 | `LumaDecoration variant=1` |
| decoration2 | `LumaDecoration variant=2` |
| decoration3 | `LumaDecoration variant=3` |
| decoration4 | `LumaDecoration variant=4` |
| decoration5 | `LumaDecoration variant=5` |
| decoration6 | `LumaDecoration variant=6` |
| decoration7 | `LumaDecoration variant=7` |
| decoration8 | `LumaDecoration variant=8` |
| decoration9 | `LumaDecoration variant=9` |
| decoration10 | `LumaDecoration variant=10` |
| decoration11 | `LumaDecoration variant=11` |
| decoration12 | `LumaDecoration variant=12` |
| fullScreenContainer | `LumaFullScreenContainer` |
| loading | `LumaLoading` |
| charts | `LumaCharts` |
| activeRingChart | `LumaActiveRingChart` |
| capsuleChart | `LumaCapsuleChart` |
| waterLevelPond | `LumaWaterLevelPond` |
| percentPond | `LumaPercentPond` |
| digitalFlop | `LumaDigitalFlop` |
| flylineChart | `LumaFlylineChart` |
| flylineChartEnhanced | `LumaFlylineChartEnhanced` |
| conicalColumnChart | `LumaConicalColumnChart` |
| scrollBoard | `LumaScrollBoard` |
| scrollRankingBoard | `LumaScrollRankingBoard` |

15 个独立入口分别为 `border-box`、`decoration`、`full-screen-container`、`loading`、`charts`、`active-ring-chart`、`capsule-chart`、`water-level-pond`、`percent-pond`、`digital-flop`、`flyline-chart`、`flyline-chart-enhanced`、`conical-column-chart`、`scroll-board` 和 `scroll-ranking-board`。

## 主题变量

组件默认值与 DataV 一致，应用仍可通过 `--luma-datav-*` 语义变量调整现代 API 外观。Cockpit 应在应用层将这些变量映射到 `--luma-cockpit-*` 浅色/深色主题。

DataV 仅作为 MIT 许可下的源码、功能和视觉重构基准，版权声明见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。
