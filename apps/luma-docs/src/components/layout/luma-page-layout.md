# LumaPageLayout

查询 / 工具栏 / 内容 / 分页四区结构。

```ts
import { LumaPageLayout } from '@luma/core/components'
```

| Prop | 说明 |
| --- | --- |
| `fill` | 高度填充 |
| `contentScrollable` | 内容区滚动 |
| `surface` | 分区表面样式 |

插槽：`query`、`toolbar`、`default`、`pagination` 等（以组件实现为准）。

适合手写列表页；标准 CRUD 可直接用 [LumaCrudTable](../table/luma-crud-table)。
