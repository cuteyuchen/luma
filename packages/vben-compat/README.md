# @luma/vben-compat

Luma 的 Vben 常用写法兼容层，支持 `useVbenForm` 常用控件映射，以及 `useVbenVxeGrid` 的 proxy、toolbar、actions、错误状态和可等待刷新流程。

```ts
import { useVbenForm, useVbenVxeGrid } from '@luma/vben-compat'
```

兼容层用于迁移旧写法，不完整复刻 Vben。完整映射、迁移步骤和不支持项见仓库文档 `docs/migration-from-vben.md`。
