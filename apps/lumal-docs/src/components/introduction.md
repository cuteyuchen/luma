# 组件文档

Lumal 组件按包分发，本文档站按 **使用场景** 组织：

| 分组 | 来源包 | 说明 |
| --- | --- | --- |
| 布局 | `@lumal/core/layout`、`components` | 后台壳、页面容器 |
| 表单 | `@lumal/core/components` | Schema 表单 |
| 表格 | `@lumal/core/components` | Schema 表 / CRUD |
| 图表 | `@lumal/charts` | 后台图表工作流 |
| DataV | `@lumal/datav` | 大屏可视化 |
| 驾驶舱 | `@lumal/cockpit` | 编排运行时与 Designer |

## 全局注册

```ts
createLumalAdmin({
  components: true, // 或组件名数组 / false
})
```

也可按需：

```ts
import { LumalSchemaForm } from '@lumal/core/components'
```

## 自动导入

```ts
import { createLumalComponentResolver } from '@lumal/vite'
// unplugin-vue-components resolvers: [createLumalComponentResolver({ importStyle: true })]
```

## 完整 API

跨组件共享约定与安装器见 [Core API](/reference/core-api)。
