# LumalCockpitDesigner

```ts
import { LumalCockpitDesigner } from '@lumal/cockpit/designer'
```

```vue
<LumalCockpitDesigner
  :config="config"
  :registry="registry"
  :saving="saving"
  @save="onSave"
  @cancel="onCancel"
/>
```

- 编辑草稿副本；`@save` 输出 `{ config, layout }`
- 包不写 localStorage / 不调 HTTP
- 只读应用可只引入 `runtime`，减小体积
