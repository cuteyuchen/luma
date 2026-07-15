import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const packageRoot = __dirname

export default defineConfig({
  plugins: [vue()],
  build: {
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        passes: 2,
      },
      format: {
        comments: false,
      },
      mangle: true,
    },
    lib: {
      cssFileName: 'datav',
      entry: {
        'active-ring-chart': resolve(packageRoot, 'src/components/LumaActiveRingChart.vue'),
        'border-box': resolve(packageRoot, 'src/components/LumaBorderBox.vue'),
        'capsule-chart': resolve(packageRoot, 'src/components/LumaCapsuleChart.vue'),
        'charts': resolve(packageRoot, 'src/components/LumaCharts.vue'),
        'conical-column-chart': resolve(packageRoot, 'src/components/LumaConicalColumnChart.vue'),
        'decoration': resolve(packageRoot, 'src/components/LumaDecoration.vue'),
        'digital-flop': resolve(packageRoot, 'src/components/LumaDigitalFlop.vue'),
        'flyline-chart': resolve(packageRoot, 'src/components/LumaFlylineChart.vue'),
        'flyline-chart-enhanced': resolve(packageRoot, 'src/components/LumaFlylineChartEnhanced.vue'),
        'full-screen-container': resolve(packageRoot, 'src/components/LumaFullScreenContainer.vue'),
        index: resolve(packageRoot, 'src/index.ts'),
        'loading': resolve(packageRoot, 'src/components/LumaLoading.vue'),
        'percent-pond': resolve(packageRoot, 'src/components/LumaPercentPond.vue'),
        'scroll-board': resolve(packageRoot, 'src/components/LumaScrollBoard.vue'),
        'scroll-ranking-board': resolve(packageRoot, 'src/components/LumaScrollRankingBoard.vue'),
        'water-level-pond': resolve(packageRoot, 'src/components/LumaWaterLevelPond.vue'),
      },
      fileName: (format, entryName) => `${entryName}.${format === 'cjs' ? 'cjs' : 'js'}`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['echarts', 'vue'],
      output: {
        exports: 'named',
      },
    },
  },
})
