# LumaCharts（DataV）

`config` 使用 DataV 官方 `@jiaminghi/charts` Canvas 运行时：

```vue
<LumaCharts
  :config="{
    xAxis: { data: ['一', '二', '三'] },
    yAxis: { data: 'value' },
    series: [{ type: 'line', data: [120, 200, 150] }],
  }"
/>
```

`option` 是保留给既有项目的 ECharts 扩展：

```vue
<LumaCharts
  :option="option"
  theme="dark"
  :auto-resize="true"
  @click="onClick"
/>
```

两套配置不互转。ref 可 `getInstance()`、`getNativeInstance()`、`setConfig()` 与 `resize()`；ECharts 实例方法仅在 `option` 模式可用。

详见 [@luma/datav](/packages/datav)。
