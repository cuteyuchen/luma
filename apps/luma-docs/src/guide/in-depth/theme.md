# 主题

## 应用主题偏好

```ts
import {
  applyThemePreferences,
  createPreferencesStore,
} from '@luma/core/theme'

const store = createPreferencesStore({
  storage: localStorage,
  storageKey: 'app:preferences',
  defaults: {
    theme: {
      mode: 'system', // 'light' | 'dark' | 'system'
      colorPrimary: '#1677ff',
      fontSize: 14, // 12–20
      radiusScale: 0.75,
    },
  },
})

// 手动应用（autoApply 默认已开启）
store.apply()
```

## 样式入口

```ts
import '@luma/core/theme-chalk/index.scss'
import '@luma/core/style.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
```

## 与布局联动

`LumaLayout` 接收 `preferences`，标签、侧栏折叠、顶栏对齐等随偏好变化。设置抽屉可 `patch` 后即时生效。

## 驾驶舱 / DataV

品牌皮肤与大屏主色由应用覆盖 CSS 变量，不要写死在 `@luma/cockpit` / `@luma/datav` 包内。
