import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

/***********************应用开发配置*********************/
export default defineConfig({
  plugins: [vue()],
  build: {
    chunkSizeWarningLimit: 500,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              maxSize: 420 * 1024,
              name: 'vendor-element-plus',
              priority: 30,
              test: /node_modules[\\/]element-plus[\\/]/,
            },
            {
              maxSize: 420 * 1024,
              name: 'vendor-vue',
              priority: 20,
              test: /node_modules[\\/](?:@vue|vue)[\\/]/,
            },
            {
              maxSize: 420 * 1024,
              name: 'vendor-luma',
              priority: 10,
              test: /[\\/]packages[\\/](?:core|icons|vben-compat)[\\/](?:dist|src)[\\/]/,
            },
          ],
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
