# 路由和菜单

## 菜单路由运行时

```ts
import { createMenuRouteRuntime } from '@lumal/core/router'

const runtime = createMenuRouteRuntime({
  router,
  staticMenus,
  loadRemoteMenus: () => api.fetchMenus(),
  componentResolver: name => viewModules[name],
  hasPermission: codes => permissionStore.hasPermission(codes),
  hasRole: roles => permissionStore.hasRole(roles),
  onError: (error, ctx) => console.error(ctx, error),
})
```

运行时负责：校验、排序、权限过滤、组件解析、**原子动态注册**，避免中间态路由闪烁。

## 菜单记录形态

```ts
interface LumalStaticMenuRecord {
  path: string
  name?: string
  component?: string | Component | (() => Promise<unknown>)
  children?: LumalStaticMenuRecord[]
  meta?: {
    title?: string
    authority?: string | string[]
    activeMenu?: string
    badge?: string | number
    // ...
  }
}
```

字符串 `component` 交给 `componentResolver` 映射到视图。

## 布局联动

`LumalLayout` 的 `menus` 通常来自 runtime 过滤后的菜单树；配合：

- 面包屑 / 全局搜索
- `activeMenu` 父级高亮
- 标签页 `routeDriven` + `routeTabResolver`

详见 [布局与标签](../in-depth/layout) 与 [LumalLayout](/components/layout/lumal-layout)。

## 非标准后端

```ts
loadRemoteMenus: async () => rawList,
remoteNormalizeOptions: {
  fieldNames: {
    path: 'url',
    title: 'menuName',
    children: 'childList',
  },
},
```
