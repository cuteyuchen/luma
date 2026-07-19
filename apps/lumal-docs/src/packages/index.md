# 包使用概览

Lumal 按职责拆包。应用只消费 **公开 `exports` 入口** 与样式路径，不要依赖 `packages/*/src` 或测试内部文件。

## 选型建议

| 场景 | 推荐包 |
| --- | --- |
| 后台壳、布局、权限、表单表格 | `@lumal/core` + icons 系列 |
| 后台图表工作流 | `@lumal/charts` |
| 大屏边框 / 装饰 / 飞线等 | `@lumal/datav` |
| 可编排驾驶舱布局与 Designer | `@lumal/cockpit`（+ 可选 datav） |
| Vite 自动导入 / monorepo alias | `@lumal/vite` |
| 从 Vben 迁移 | `@lumal/vben-compat` |
| 快速起项目 | `create-lumal-admin` |

## 包卡片

| 包 | 说明 | 文档 | 本地路径 |
| --- | --- | --- | --- |
| [@lumal/core](./core) | 安装器、布局、路由权限、请求、主题、Schema 组件 | [本地](http://localhost:5173/packages/core) | `packages/core` |
| [@lumal/icons](./icons) | 框架无关图标内核 | [本地](http://localhost:5173/packages/icons) | `packages/icons` |
| [@lumal/icons-vue](./icons-vue) | Vue 图标组件 | [本地](http://localhost:5173/packages/icons-vue) | `packages/icons-vue` |
| [@lumal/charts](./charts) | ECharts 图表与面板 | [本地](http://localhost:5173/packages/charts) | `packages/charts` |
| [@lumal/datav](./datav) | DataV 风格可视化组件 | [本地](http://localhost:5173/packages/datav) | `packages/datav` |
| [@lumal/cockpit](./cockpit) | 驾驶舱编排框架 | [本地](http://localhost:5173/packages/cockpit) | `packages/cockpit` |
| [@lumal/vite](./vite) | Resolver 与 workspace alias | [本地](http://localhost:5173/packages/vite) | `packages/vite` |
| [@lumal/vben-compat](./vben-compat) | Vben 常用 API 兼容 | [本地](http://localhost:5173/packages/vben-compat) | `packages/vben-compat` |
| [create-lumal-admin](./create-lumal-admin) | 脚手架 CLI | [本地](http://localhost:5173/packages/create-lumal-admin) | `packages/create-lumal-admin` |

> 上线后将「本地」列替换为正式文档域名或 npm 包页，见 [安装与版本](/guide/installation)。

## 安装顺序（典型 Admin）

```bash
pnpm add vue vue-router pinia element-plus
pnpm add @lumal/core @lumal/icons @lumal/icons-vue
# 按需
pnpm add @lumal/charts echarts vue-echarts
pnpm add -D @lumal/vite
```

未发布到 npm 时使用 `workspace:*` 或 `file:`，见 [安装与版本](/guide/installation)。
