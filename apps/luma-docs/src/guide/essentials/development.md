# 本地开发

## 安装与启动

```bash
pnpm install
pnpm admin:dev      # Admin + Mock
pnpm docs:dev       # 文档站
```

## 源码 HMR

`apps/*/vite.config.ts` 使用：

```ts
import { createLumaAliases } from '@luma/vite'

createLumaAliases({
  workspaceRoot: resolve(__dirname, '../..'),
  target: 'source', // 开发
})
```

`target: 'source'` 时别名指向 `packages/*/src`，修改包代码即时 HMR。  
验证产物时改为 `target: 'dist'`，并先 `pnpm build`。

## 推荐工作流

1. 在包内改能力（`packages/*`）
2. 在 `apps/luma-admin`（或对应 demo）验收
3. `pnpm --filter <pkg> test` / `typecheck`
4. 更新文档站对应页面
5. 提交：`<type>(<scope>): <中文动宾描述>`

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `pnpm test` | 单测链路 |
| `pnpm typecheck` | 类型检查 |
| `pnpm build` | 构建可发布包 |
| `pnpm lint` | ESLint |
| `pnpm release:boundaries` | 包边界检查 |
| `pnpm test:e2e` | Playwright |

## 约定

- Vue 组件：`<script setup lang="ts">`，模板 ref 优先 `useTemplateRef`
- 样式：SCSS + 语义变量，避免硬编码主题色
- Admin 只通过 `@luma/*` 公开入口消费
