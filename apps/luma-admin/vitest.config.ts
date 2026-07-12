import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify('http://127.0.0.1:5321/api'),
  },
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    fileParallelism: false,
    globalSetup: ['./tests/global-setup.ts'],
    globals: true,
  },
})
