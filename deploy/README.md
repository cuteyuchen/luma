# Lumal 部署说明

## 推荐拓扑

- GitHub：源码、Pull Request、CI、CodeQL、Changesets 发布 npm 包。
- Vercel：VitePress 文档和所有静态 Demo，每个应用一个 Project。
- Node 服务：`apps/lumal-mock-api`。它使用 Nitro `node-server` preset，应作为长期运行的 Node 服务部署。

## Vercel 项目

所有 Vercel Project 都连接同一个仓库，并将 **Root Directory** 保持为仓库根目录：

| Project | Build Command | Output Directory |
| --- | --- | --- |
| lumal-docs | `pnpm docs:build` | `apps/lumal-docs/dist` |
| lumal-admin-demo | `pnpm admin:build` | `apps/lumal-admin/dist` |
| lumal-cockpit-demo | `pnpm --filter @lumal/cockpit build && pnpm --filter lumal-cockpit build` | `apps/lumal-cockpit/dist` |
| lumal-datav-guide | `pnpm --filter @lumal/datav build && pnpm --filter lumal-datav-guide build` | `apps/lumal-datav-guide/dist` |
| lumal-vben-compat-demo | `pnpm compat:build` | `apps/vben-compat-demo/dist` |

Install Command 统一使用：

```bash
pnpm install --frozen-lockfile
```

Node.js 使用 22，pnpm 使用 `package.json` 中声明的 10.33.0。

## 环境变量

文档站的外链通过 `apps/lumal-docs/src/.vitepress/config/links.ts` 注入：

```text
LUMAL_DOCS_URL
LUMAL_ADMIN_DEMO_URL
LUMAL_COCKPIT_DEMO_URL
LUMAL_DATAV_GUIDE_URL
LUMAL_GITHUB_URL
LUMAL_NPM_SCOPE_URL
LUMAL_DOCS_EDIT_PATTERN
LUMAL_NPM_CORE ... LUMAL_NPM_CREATE
```

## Mock API

Mock API 是演示用途，当前数据在内存中，不应当作生产数据库服务。容器启动命令为：

```bash
pnpm --filter lumal-mock-api build
pnpm --filter lumal-mock-api start
```

Docker 构建文件在 `apps/lumal-mock-api/Dockerfile`。

## Cloudflare

Cloudflare Pages 可以替代 Vercel 托管静态站，但需要为每个应用建立独立 Pages Project。Mock API 只有在切换并验证 Nitro 的 Cloudflare preset 后，才建议迁移到 Workers。
