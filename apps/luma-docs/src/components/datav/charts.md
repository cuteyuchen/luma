# LumaCharts（DataV）

原生 ECharts 封装（与 `@luma/charts` 的后台面板不同）。

```vue
<LumaCharts
  :option="option"
  theme="dark"
  :auto-resize="true"
  @click="onClick"
/>
```

`option` 类型为完整 `EChartsOption`；ref 可 `getInstance()` 及常用实例方法。

详见 [@luma/datav](/packages/datav)。
