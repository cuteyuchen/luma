# 安装与包地址

## 包列表

> **占位说明**：未发布 npm 时使用「本地路径」与「文档本地地址」；上线后将 npm 列替换为正式 registry 链接。  
> 文档默认：`http://localhost:5173`（`pnpm docs:dev`）

| 包名 | 本地路径 | 文档 | npm / 外链（占位→正式） |
| --- | --- | --- | --- |
| `@luma/core` | `packages/core` | [/packages/core](/packages/core) | `http://localhost:5173/packages/core` → `https://www.npmjs.com/package/@luma/core` |
| `@luma/icons` | `packages/icons` | [/packages/icons](/packages/icons) | 同上规则 |
| `@luma/icons-vue` | `packages/icons-vue` | [/packages/icons-vue](/packages/icons-vue) | 同上 |
| `@luma/charts` | `packages/charts` | [/packages/charts](/packages/charts) | 同上 |
| `@luma/datav` | `packages/datav` | [/packages/datav](/packages/datav) | 同上 |
| `@luma/cockpit` | `packages/cockpit` | [/packages/cockpit](/packages/cockpit) | 同上 |
| `@luma/vite` | `packages/vite` | [/packages/vite](/packages/vite) | 同上 |
| `@luma/vben-compat` | `packages/vben-compat` | [/packages/vben-compat](/packages/vben-compat) | 同上 |
| `create-luma-admin` | `packages/create-luma-admin` | [/packages/create-luma-admin](/packages/create-luma-admin) | 同上 |

## 正式安装（发布后）

```bash
pnpm add @luma/core @luma/icons @luma/icons-vue element-plus vue vue-router pinia
pnpm add @luma/charts echarts vue-echarts   # 可选
pnpm add @luma/datav echarts               # 可选
pnpm add @luma/cockpit                     # 可选
pnpm add -D @luma/vite
pnpm add @luma/vben-compat                 # 迁移
```

## 本地 monorepo

```json
{
  "dependencies": {
    "@luma/core": "workspace:*",
    "@luma/icons": "workspace:*",
    "@luma/icons-vue": "workspace:*"
  }
}
```

## 外部项目 file 依赖

```bash
pnpm add @luma/core@file:../luma/packages/core
```

使用前在 monorepo 根目录 `pnpm build`。

## 环境变量（文档构建）

| 变量 | 含义 | 默认 |
| --- | --- | --- |
| `LUMA_DOCS_URL` | 文档站根 | `http://localhost:5173` |
| `LUMA_ADMIN_DEMO_URL` | Admin 演示 | `http://localhost:5174` |
| `LUMA_COCKPIT_DEMO_URL` | 驾驶舱演示 | `http://localhost:5175` |
| `LUMA_DATAV_GUIDE_URL` | DataV 指南 | `http://localhost:5176` |
| `LUMA_GITHUB_URL` | 仓库 | `https://github.com/example/luma` |
| `LUMA_NPM_*` | 各包 npm 页 | 指向本地文档包页 |

配置文件：`apps/luma-docs/src/.vitepress/config/links.ts`。

## Peer 依赖摘要

见各 [包文档](/packages/) 页内说明。
