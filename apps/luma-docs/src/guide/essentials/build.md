# 构建与部署

## 构建包

```bash
pnpm build
```

按依赖顺序构建 icons → icons-vue → core → charts → datav → cockpit → vben-compat → vite → create-luma-admin → mock-api。

## 构建 Admin

```bash
pnpm admin:build
```

## 构建文档

```bash
pnpm docs:build
# 产物：apps/luma-docs/dist
pnpm docs:preview
```

上线示例：

```bash
LUMA_DOCS_URL=https://docs.example.com \
LUMA_ADMIN_DEMO_URL=https://admin.example.com \
LUMA_GITHUB_URL=https://github.com/your-org/luma \
pnpm docs:build
```

将 `apps/luma-docs/dist` 部署到任意静态托管（Nginx、OSS、GitHub Pages 等）。

## 产物检查

```bash
pnpm release:artifacts
pnpm pack:dry-run
```

Admin 单 JS 块体积等门禁见 [发布检查清单](/reference/release-checklist)。
