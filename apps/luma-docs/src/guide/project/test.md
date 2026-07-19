# 测试与验收

```bash
pnpm test              # 单元测试链路
pnpm test:e2e          # Playwright 关键流程
pnpm test:datav:visual # DataV 视觉
pnpm typecheck
pnpm lint
```

包级：

```bash
pnpm --filter @luma/core test
pnpm --filter luma-admin test
```

发布前建议：

```bash
pnpm release:check
```
