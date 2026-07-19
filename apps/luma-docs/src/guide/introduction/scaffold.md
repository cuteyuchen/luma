# 脚手架项目

使用 `create-luma-admin` 生成独立后台基座，**只通过公开包入口**消费 `@luma/*`，不依赖 monorepo 内部路径。

## 命令

```bash
pnpm create luma-admin my-admin
pnpm create luma-admin my-admin --api-mode local   # 默认
pnpm create luma-admin my-admin --api-mode http
```

| 模式 | 内容 |
| --- | --- |
| `local` | 浏览器内请求示例 |
| `http` | 额外生成 `VITE_API_BASE_URL`、请求客户端、登录刷新示例、`API-CONTRACT.md` |

## 生成内容

- Vue 3 + TypeScript + Vite + Element Plus
- `createLumaAdmin` + 主题 / 样式入口
- `LumaLayout` + `LumaRouterView`（路由驱动标签、固定首页、会话持久化）
- 登录、会话、权限菜单、守卫、403 / 404
- 主题与布局偏好、设置抽屉
- 明确 vendor 分包配置

**不会**生成完整用户 / 角色 / 菜单 / 字典系统管理业务（参考 `apps/luma-admin`）。

## 本地调试脚手架本身

```bash
pnpm --filter create-luma-admin build
node packages/create-luma-admin/dist/cli.js tmp-admin
```

更多说明：[create-luma-admin 包文档](/packages/create-luma-admin)
