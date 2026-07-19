# 从 Vben 迁移

使用 `@lumal/vben-compat` 过渡常见写法：

```ts
import { useVbenForm, useVbenVxeGrid } from '@lumal/vben-compat'
```

- **不**完整复刻 Vben
- 新功能优先用 Lumal 原生 Schema / CRUD
- 完整映射与不支持项见 [从 Vben 迁移](/reference/migration-from-vben)
- 包说明：[vben-compat](/packages/vben-compat)
- 示例：`apps/vben-compat-demo`
