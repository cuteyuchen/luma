# LumalPage

页面级卡片容器，支持标题、描述、填充高度与内边距控制。

```ts
import { LumalPage } from '@lumal/core/components'
```

```vue
<template>
  <LumalPage
    title="项目管理"
    description="需要 project:list 权限的页面"
  >
    内容
  </LumalPage>
</template>
```

| Prop | 说明 |
| --- | --- |
| `title` | 标题 |
| `description` | 描述 |
| `fill` | 填充父级高度 |
| `noPadding` | 去掉内边距 |
| `contentClass` | 内容区 class |

`LumalCrudTable` **不包含** Page 壳，需要 header 时由页面自行包裹 `LumalPage`。
