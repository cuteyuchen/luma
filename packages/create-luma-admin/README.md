# create-luma-admin

`create-luma-admin` 是 Luma 的最小后台项目脚手架，用于生成通过公开包入口消费 `@luma/core` 和 `@luma/icons` 的 Vue 应用。

## 使用

```bash
pnpm create luma-admin my-admin
```

生成后执行：

```bash
cd my-admin
pnpm install
pnpm dev
```

## 生成内容

- Vue 3 + TypeScript + Vite。
- Element Plus 作为 UI 基础。
- SCSS 样式入口。
- `createLumaAdmin` 应用启动代码。
- `LumaLayout` 后台布局壳和 `LumaRouterView` 路由出口。
- Vue Router hash 路由、菜单节点、权限守卫和 403 页面。
- `LumaCrudTable` 工作台示例页面。
- `createRequestClient` 请求封装示例。

脚手架生成的项目只通过 `@luma/core`、`@luma/icons` 等公开包入口消费能力，不依赖 monorepo 内部源码路径。
