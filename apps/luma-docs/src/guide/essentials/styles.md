# 样式

## 必须引入的入口

```ts
import '@luma/core/theme-chalk/index.scss'
import '@luma/core/style.css'
import '@luma/icons-vue/style.css'
// 按需
import '@luma/charts/style.css'
import '@luma/datav/style.css'
import '@luma/cockpit/style.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
```

## 主题变量

- core 通过 theme-chalk 与偏好 Store 驱动主色、字号、圆角等
- datav：`--luma-datav-*`
- cockpit：`--luma-cockpit-*`（应用层映射品牌皮肤）

## 约定

- 包级与应用级优先 **SCSS + 语义变量**
- 业务组件不硬编码主题色、间距、z-index
- 暗色模式依赖 Element Plus CSS 变量 + Luma 偏好应用

详见 [主题深入](../in-depth/theme)。
