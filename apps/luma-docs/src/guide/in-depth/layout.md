# 布局与标签

## LumaLayout

```vue
<LumaLayout
  title="My Admin"
  :menus="menus"
  :preferences="preferences"
  route-driven
  :fixed-tabs="[{ path: '/dashboard', title: '首页' }]"
  tab-storage-key="my-admin:tabs"
  :tab-max-count="20"
>
  <LumaRouterView />
</LumaLayout>
```

## 标签策略

- 固定标签（`closable: false` / `pinned`）不受批量关闭与 maxCount 淘汰
- `appendTab` / `clampTabCount` 保护当前活动标签
- 支持固定、关闭左/右/其他/全部、拖拽排序
- `tabStorageKey` 会话级快照

## 布局模式

偏好 `app.layout` 支持侧栏、顶栏、混合导航等（与 Admin 默认 `mixed-nav` 对齐）。移动端抽屉菜单自动适配。

组件文档：[LumaLayout](/components/layout/luma-layout)
