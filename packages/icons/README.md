# @lumal/icons

框架无关的 Lumal 图标内核，提供图标注册表、分组、SVG 改色、渐变、校验、合成、Data URI 缓存和 Vite 静态 SVG 插件。

```ts
import { recolorSvgString, registerIcons } from '@lumal/icons'

registerIcons([
  {
    key: 'app:dashboard',
    source: 'local-svg',
    svgText: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="..."/></svg>',
  },
])

const blueSvg = recolorSvgString(svgText, '#1677ff')
```

该包没有 Vue 或其他 UI 框架运行时依赖。Vue 组件由 `@lumal/icons-vue` 提供，详细说明见仓库文档 `docs/icons.md`。
