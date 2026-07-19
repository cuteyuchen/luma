# @luma/vite

Vite 配置助手：组件 resolver、工作区源码 / 产物 alias、可选 Devtools 接线。

| 项 | 值 |
| --- | --- |
| 包名 | `@luma/vite` |
| 本地路径 | `packages/vite` |
| 文档（本地占位） | http://localhost:5173/packages/vite |
| 正式地址（上线后） | `https://www.npmjs.com/package/@luma/vite` |

## 安装

```bash
pnpm add -D @luma/vite
```

## 公开入口

仅 `@luma/vite`。

## Workspace Alias

```ts
import { resolve } from 'node:path'
import { createLumaAliases } from '@luma/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: createLumaAliases({
      workspaceRoot: resolve(__dirname, '../..'),
      // 开发默认 source；CI 验证 dist 时可改为 'dist'
      target: 'source',
      // packages: ['core', 'icons', 'icons-vue', 'charts', 'datav', 'cockpit', 'vben-compat'],
    }),
  },
})
```

`createLumaAliases` 会为各包主入口、子路径（如 `@luma/core/layout`）与 `style.css` 生成别名，并按路径长度排序，避免前缀冲突。

## 组件 Resolver

配合 `unplugin-vue-components` 等：

```ts
import { createLumaComponentResolver } from '@luma/vite'
import Components from 'unplugin-vue-components/vite'

export default {
  plugins: [
    Components({
      resolvers: [
        createLumaComponentResolver({ importStyle: true }),
      ],
    }),
  ],
}
```

内置解析（节选）：`LumaSchemaForm`、`LumaLayout`、`LumaIcon`、`LumaChart`、`LumaChartPanel` 等。`importStyle: true` 时附加对应 `style.css` sideEffects。

可通过 `customComponents` 扩展名称 → 包名映射。

## 边界

- 不强制安装自动导入、Devtools 或 viewport 转换插件
- 无 `@luma/core` 运行时依赖
