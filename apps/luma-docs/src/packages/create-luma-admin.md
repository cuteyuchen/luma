# create-luma-admin

轻量后台基座脚手架，生成通过公开包入口消费 Luma 的 Vue 3 应用。

| 项 | 值 |
| --- | --- |
| 包名 | `create-luma-admin` |
| 本地路径 | `packages/create-luma-admin` |
| 文档（本地占位） | http://localhost:5173/packages/create-luma-admin |
| 正式地址（上线后） | `https://www.npmjs.com/package/create-luma-admin` |
| CLI | `create-luma-admin` |

## 使用

```bash
pnpm create luma-admin my-admin
pnpm create luma-admin my-admin --api-mode http
```

| 选项 | 说明 |
| --- | --- |
| 默认 / `--api-mode local` | 浏览器内请求示例 |
| `--api-mode http` | 额外生成 `VITE_API_BASE_URL`、请求客户端、登录刷新示例与 `API-CONTRACT.md` |

```bash
cd my-admin
pnpm install
pnpm dev
```

## 生成内容

- Vue 3 + TypeScript + Vite + Element Plus
- `@luma/core` 主题与样式入口 + `createLumaAdmin`
- `LumaLayout` + `LumaRouterView`（路由驱动标签、固定首页、会话持久化）
- 登录、会话、权限菜单、路由守卫
- 工作台、受保护页、403 / 404
- 主题与布局偏好、全局设置抽屉
- `createRequestClient` 示例与明确 vendor 分包

**不会**生成完整用户 / 角色 / 菜单 / 字典 CRUD 业务（见 `apps/luma-admin` 示例）。

## monorepo 内调试脚手架

```bash
pnpm --filter create-luma-admin build
node packages/create-luma-admin/dist/cli.js my-admin
```

## 边界

- 生成项目只依赖公开包入口，不 alias 到 monorepo 源码
- 业务协议写在应用层 `API-CONTRACT.md` / adapter，不进入 `@luma/core`
