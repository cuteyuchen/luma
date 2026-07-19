# LumaCockpit

```ts
import { LumaCockpit } from '@luma/cockpit/runtime'
import '@luma/cockpit/style.css'
```

```vue
<LumaCockpit
  v-model:active-layout-id="activeLayoutId"
  :config="config"
  :registry="registry"
  viewport-mode="scale"
>
  <template #header-title="{ title }">
    <AppHeader :title="title" />
  </template>
  <template #center="{ context, layout }">
    <ApplicationCenter :context="context" :layout="layout" />
  </template>
</LumaCockpit>
```

- 中心内容由应用插槽提供，不进配置
- `viewportMode`: `scale` | `vwvh`
- 包文档：[@luma/cockpit](/packages/cockpit)
