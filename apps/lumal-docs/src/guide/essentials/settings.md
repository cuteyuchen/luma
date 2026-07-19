# 偏好与配置

## 偏好 Store

```ts
import { createPreferencesStore } from '@lumal/core/theme'

const store = createPreferencesStore({
  storage: localStorage,
  storageKey: 'my-app:preferences',
  defaults: {
    app: { layout: 'mixed-nav', dynamicTitle: true },
    theme: { mode: 'system', colorPrimary: '#1677ff', fontSize: 14 },
    tabbar: { enable: true, maxCount: 0, styleType: 'chrome' },
    sidebar: { enable: true, width: 280, collapsed: false },
  },
})

store.patch({ theme: { mode: 'dark' } })
store.reset()
store.exportCurrent()
```

- `autoApply` 默认 `true`，会写入 DOM 并监听系统主题
- 存储失败（隐私模式 / 配额）不阻断会话

## 布局偏好常用字段

| 分组 | 字段示例 |
| --- | --- |
| `app` | `layout`、`dynamicTitle` |
| `theme` | `mode`、`colorPrimary`、`fontSize`、`radiusScale` |
| `tabbar` | `enable`、`maxCount`、`persist`、`styleType` |
| `sidebar` | `collapsed`、`width` |
| `header` | `menuAlign`、`globalSearch` |
| `breadcrumb` | `enable`、`showIcon` |
| `transition` | `enable`、`name` |

## 与布局组件

将 `store.state`（或映射后的对象）传给 `LumalLayout` 的 `preferences`。示例见 `apps/lumal-admin/src/services/preferences.ts`。
