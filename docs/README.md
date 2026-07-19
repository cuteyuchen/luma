# 文档说明

正式文档站位于 **`apps/luma-docs`**（VitePress，结构参考 [Vben 文档](https://doc.vben.pro/)）。

```bash
pnpm docs:dev      # http://127.0.0.1:5173
pnpm docs:build
pnpm docs:preview
```

本目录保留 monorepo 内长文 Markdown（架构、Core API、路线图等），并同步维护在文档站 `src/reference/`。指南 / 包使用 / 组件文档以 `apps/luma-docs` 为准。

外链占位（演示、npm、GitHub）见：

`apps/luma-docs/src/.vitepress/config/links.ts`
