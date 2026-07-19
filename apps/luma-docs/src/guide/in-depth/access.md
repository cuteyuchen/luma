# 权限

## 权限 Store

应用创建并注入：

```ts
createLumaAdmin({
  permissionStore,
  // ...
})
```

菜单 runtime 使用 `hasPermission` / `hasRole` 过滤节点；路由 meta 的 `authority` 驱动 403。

## 指令

```ts
import { registerAuthorityDirectives } from '@luma/core/directives'

registerAuthorityDirectives(app)
```

模板中控制按钮级显隐（具体指令名与用法见 Core API / Admin 示例）。

## Schema 字段权限

表单 / 表格列支持：

- `authority`：无权限则隐藏
- `readonlyAuthority`：无权限只读

## 原则

- 权限码字符串由 **业务** 定义
- 框架只消费字符串数组 / 函数，不做业务码表
