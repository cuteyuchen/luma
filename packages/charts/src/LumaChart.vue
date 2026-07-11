<script setup lang="ts">
import type { EChartsOption, SetOptionOpts } from 'echarts'
import type { ComponentPublicInstance } from 'vue'
import { computed, nextTick, onBeforeUnmount, onMounted, shallowRef, useTemplateRef } from 'vue'
import VChart from 'vue-echarts'
import { useChartResize } from './useChartResize'

/***********************属性定义*********************/
const props = withDefaults(defineProps<{
  options: EChartsOption
  updateOptions?: SetOptionOpts
  autoResize?: boolean
  animation?: boolean
  ariaLabel?: string
  width?: string
  height?: string
}>(), {
  autoResize: true,
  animation: undefined,
  ariaLabel: '数据图表',
  height: '100%',
  updateOptions: undefined,
  width: '100%',
})

/***********************渲染状态*********************/
// 延迟到挂载后渲染，规避容器尺寸为 0 时的初始布局问题
const renderChart = shallowRef(false)
const prefersReducedMotion = shallowRef(false)
const resolvedOptions = computed<EChartsOption>(() => ({
  ...props.options,
  animation: props.animation ?? !prefersReducedMotion.value,
}))
let motionQuery: MediaQueryList | undefined

function syncReducedMotion(event: MediaQueryListEvent | MediaQueryList): void {
  prefersReducedMotion.value = event.matches
}

/***********************模板引用*********************/
const chartRef = useTemplateRef<ComponentPublicInstance & { resize: () => void }>('chartRef')

onMounted(() => {
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    syncReducedMotion(motionQuery)
    motionQuery.addEventListener?.('change', syncReducedMotion)
  }

  void nextTick(() => {
    renderChart.value = true
  })
})

onBeforeUnmount(() => {
  motionQuery?.removeEventListener?.('change', syncReducedMotion)
})

/***********************尺寸自适应*********************/
useChartResize(chartRef)

/***********************公开方法*********************/
defineExpose({
  resize: () => chartRef.value?.resize(),
})
</script>

<template>
  <div class="luma-chart" role="img" :aria-label="ariaLabel" :style="{ height, width }">
    <VChart
      v-if="renderChart"
      ref="chartRef"
      class="luma-chart__canvas"
      :option="resolvedOptions"
      :update-options="updateOptions"
      :autoresize="autoResize"
    />
  </div>
</template>

<style scoped lang="scss">
.luma-chart {
  width: 100%;
  height: 100%;
}

.luma-chart__canvas {
  width: 100%;
  height: 100%;
}
</style>
