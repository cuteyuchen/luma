import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

/***********************独立驾驶舱应用配置*********************/
// 独立应用自行决定第三方依赖的分包与静态资源策略，不进入 @luma/cockpit 发布检查。
export default defineConfig({
  plugins: [vue()],
  build: {
    chunkSizeWarningLimit: 500,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
