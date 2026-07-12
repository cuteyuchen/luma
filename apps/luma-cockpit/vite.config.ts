import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

/***********************独立驾驶舱应用配置*********************/
// 独立应用自行决定第三方依赖的分包与静态资源策略，不进入 @luma/cockpit 发布检查。
export default defineConfig({
  plugins: [vue()],
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/vue') || id.includes('/@vue/'))
            return 'vendor-vue'
          if (id.includes('node_modules/element-plus'))
            return 'vendor-element-plus'
          if (id.includes('node_modules/echarts') || id.includes('node_modules/vue-echarts'))
            return 'vendor-echarts'
          if (id.includes('/packages/core/') || id.includes('/packages/icons/') || id.includes('/packages/charts/'))
            return 'vendor-luma'
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
