# Vite 配置

使用 `@lumal/vite`：

```ts
import { resolve } from 'node:path'
import {
  createLumalAliases,
  createLumalComponentResolver,
} from '@lumal/vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [createLumalComponentResolver({ importStyle: true })],
    }),
  ],
  resolve: {
    alias: createLumalAliases({
      workspaceRoot: resolve(__dirname, '../..'),
      target: 'source',
    }),
  },
})
```

完整说明：[@lumal/vite](/packages/vite)
