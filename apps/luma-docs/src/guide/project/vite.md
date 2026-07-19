# Vite 配置

使用 `@luma/vite`：

```ts
import { resolve } from 'node:path'
import {
  createLumaAliases,
  createLumaComponentResolver,
} from '@luma/vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [createLumaComponentResolver({ importStyle: true })],
    }),
  ],
  resolve: {
    alias: createLumaAliases({
      workspaceRoot: resolve(__dirname, '../..'),
      target: 'source',
    }),
  },
})
```

完整说明：[@luma/vite](/packages/vite)
