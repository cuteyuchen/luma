# 基础概念

## 应用 vs 框架包

| 层 | 职责 |
| --- | --- |
| `packages/*` | 可复用运行时、组件、工具；**无业务字段** |
| `apps/*` | 消费方：接口适配、页面、权限码、菜单数据 |
| 业务项目 | 同 apps：通过 npm / file / workspace 依赖 `@luma/*` |

## 标准语义字段

框架内部优先使用稳定字段，应用层做映射：

- **菜单**：`path`、`name`、`component`、`children`、`meta.title`、`meta.authority`、`meta.activeMenu`、`meta.badge`
- **字典**：`label`、`value`、`color`、`disabled`、`children`
- **表单 / 表格**：`field`、`dictionary`、`options`、`componentProps`
- **分页**：`{ items, total }`
- **会话**：`{ accessToken, refreshToken?, expiresAt? }`

非标准结构用 `fieldNames`、`parseResponse`、`transform` 或专用 adapter，**禁止**在组件内散落公司字段名。

## 公开入口

每个包通过 `package.json` `exports` 暴露入口，例如：

```ts
import { createLumaAdmin } from '@luma/core'
import { LumaSchemaForm } from '@luma/core/components'
import { createMenuRouteRuntime } from '@luma/core/router'
import '@luma/core/style.css'
```

应用不得依赖 `packages/*/src` 或测试内部文件（monorepo 开发可用 `@luma/vite` alias）。

## 依赖方向（简图）

```text
@luma/icons → @luma/icons-vue → @luma/core ← apps
@luma/cockpit → @luma/core
@luma/vben-compat → @luma/core
@luma/charts / @luma/datav   （独立）
@luma/vite                   （构建）
```

详见 [包边界](../project/boundaries)。
