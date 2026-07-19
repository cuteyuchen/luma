<script setup lang="ts">
import type Charts from '@jiaminghi/charts'
import type {
  EChartsInitOpts,
  EChartsOption,
  EChartsType,
  ResizeOpts,
  SetOptionOpts,
} from 'echarts'
import type { DataVChartsOption } from '../types'
import ChartsModule from '@jiaminghi/charts'
import * as echarts from 'echarts'
import { computed, nextTick, onBeforeUnmount, onMounted, shallowRef, useAttrs, useTemplateRef, watch, watchEffect } from 'vue'

type EChartsEventHandler = (...args: unknown[]) => void

const props = withDefaults(defineProps<{
  /** DataV/@jiaminghi/charts 原生协议。传入后优先使用官方 Canvas 运行时。 */
  config?: DataVChartsOption
  /** Luma 扩展：保留既有 ECharts option 协议。 */
  option?: EChartsOption
  theme?: string | object | null
  initOptions?: EChartsInitOpts
  setOptionOptions?: SetOptionOpts
  autoResize?: boolean
  events?: Readonly<Record<string, EChartsEventHandler>>
  group?: string
  loading?: boolean
  loadingType?: string
  loadingOptions?: object
  ariaLabel?: string
}>(), {
  ariaLabel: undefined,
  autoResize: true,
  config: undefined,
  events: () => ({}),
  group: undefined,
  initOptions: undefined,
  loading: false,
  loadingOptions: undefined,
  loadingType: 'default',
  option: () => ({}),
  setOptionOptions: undefined,
  theme: undefined,
})

const ChartsRuntime = ((ChartsModule as unknown as { default?: typeof Charts }).default ?? ChartsModule) as typeof Charts
const attrs = useAttrs()
const rootRef = useTemplateRef<HTMLElement>('rootRef')
const chartHostRef = useTemplateRef<HTMLElement>('chartHostRef')
const echartsRef = shallowRef<EChartsType>()
const dataVRef = shallowRef<Charts>()
const attachedEvents = new Map<string, EChartsEventHandler>()
const dataVMode = computed(() => props.config !== undefined)
const resolvedAriaLabel = computed(() => props.ariaLabel ?? (dataVMode.value ? 'DataV 图表' : 'ECharts 图表'))
let resizeObserver: ResizeObserver | undefined
let resizeFrame = 0

function attrEventName(key: string): string | undefined {
  if (!key.startsWith('on') || key.length <= 2)
    return undefined
  return key.slice(2).toLowerCase()
}

function resolvedEvents(): Map<string, EChartsEventHandler> {
  const result = new Map<string, EChartsEventHandler>()
  Object.entries(props.events).forEach(([name, handler]) => result.set(name.toLowerCase(), handler))
  Object.entries(attrs).forEach(([key, value]) => {
    const name = attrEventName(key)
    if (name && typeof value === 'function')
      result.set(name, value as EChartsEventHandler)
  })
  return result
}

function syncEvents(): void {
  const chart = echartsRef.value
  if (!chart)
    return
  attachedEvents.forEach((handler, name) => chart.off(name, handler))
  attachedEvents.clear()
  resolvedEvents().forEach((handler, name) => {
    chart.on(name, handler)
    attachedEvents.set(name, handler)
  })
}

function stopDataVAnimations(): void {
  dataVRef.value?.render.graphs.forEach(graph => graph.animationEnd())
}

function disposeCharts(): void {
  stopDataVAnimations()
  dataVRef.value = undefined
  attachedEvents.clear()
  echartsRef.value?.dispose()
  echartsRef.value = undefined
  chartHostRef.value?.replaceChildren()
}

function applyEChartsOption(option: EChartsOption): void {
  const chart = echartsRef.value
  if (!chart)
    return
  if (props.setOptionOptions)
    chart.setOption(option, props.setOptionOptions)
  else
    chart.setOption(option)
}

function applyDataVConfig(config: DataVChartsOption, animationEnd = true): void {
  dataVRef.value?.setOption(config, animationEnd)
}

function createChart(): void {
  const element = chartHostRef.value
  if (!element || !element.clientWidth || !element.clientHeight)
    return

  disposeCharts()
  if (dataVMode.value) {
    const chart = new ChartsRuntime(element)
    dataVRef.value = chart
    chart.setOption(props.config ?? {})
    return
  }

  const chart = echarts.init(element, props.theme, props.initOptions)
  echartsRef.value = chart
  if (props.group)
    chart.group = props.group
  applyEChartsOption(props.option)
  syncEvents()
  if (props.loading)
    chart.showLoading(props.loadingType, props.loadingOptions)
}

function scheduleResize(options?: ResizeOpts): void {
  cancelAnimationFrame(resizeFrame)
  resizeFrame = requestAnimationFrame(() => {
    if (dataVRef.value)
      dataVRef.value.resize()
    else
      echartsRef.value?.resize(options)
  })
}

watch(() => props.config, (config) => {
  if (config !== undefined && dataVRef.value)
    applyDataVConfig(config)
}, { deep: false })
watch(() => props.option, (option) => {
  if (!dataVMode.value)
    applyEChartsOption(option)
}, { deep: false })
watch(dataVMode, () => void nextTick(createChart))
watch(() => props.group, (group) => {
  if (echartsRef.value)
    echartsRef.value.group = group ?? ''
})
watchEffect(() => {
  Object.keys(attrs)
  void props.events
  syncEvents()
})
watch(() => props.loading, (loading) => {
  const chart = echartsRef.value
  if (!chart)
    return
  if (loading)
    chart.showLoading(props.loadingType, props.loadingOptions)
  else
    chart.hideLoading()
})
watch(() => [props.theme, props.initOptions] as const, () => {
  if (!dataVMode.value)
    void nextTick(createChart)
}, { deep: false })

onMounted(async () => {
  await nextTick()
  if (props.autoResize && rootRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      if (dataVRef.value || echartsRef.value)
        scheduleResize()
      else
        createChart()
    })
    resizeObserver.observe(rootRef.value)
  }
  createChart()
  if (!dataVRef.value && !echartsRef.value)
    resizeFrame = requestAnimationFrame(createChart)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(resizeFrame)
  resizeObserver?.disconnect()
  disposeCharts()
})

defineExpose({
  appendData: (...args: Parameters<EChartsType['appendData']>) => echartsRef.value?.appendData(...args),
  clear: () => dataVRef.value ? dataVRef.value.setOption({}, true) : echartsRef.value?.clear(),
  containPixel: (...args: Parameters<EChartsType['containPixel']>) => echartsRef.value?.containPixel(...args),
  convertFromPixel: (...args: Parameters<EChartsType['convertFromPixel']>) => echartsRef.value?.convertFromPixel(...args),
  convertToPixel: (...args: Parameters<EChartsType['convertToPixel']>) => echartsRef.value?.convertToPixel(...args),
  dispatchAction: (...args: Parameters<EChartsType['dispatchAction']>) => echartsRef.value?.dispatchAction(...args),
  dispose: disposeCharts,
  getConnectedDataURL: (...args: Parameters<EChartsType['getConnectedDataURL']>) => echartsRef.value?.getConnectedDataURL(...args),
  getDataURL: (...args: Parameters<EChartsType['getDataURL']>) => echartsRef.value?.getDataURL(...args),
  getHeight: () => dataVRef.value ? chartHostRef.value?.clientHeight : echartsRef.value?.getHeight(),
  getInstance: () => dataVRef.value ?? echartsRef.value,
  getNativeInstance: () => dataVRef.value,
  getOption: () => dataVRef.value?.option ?? echartsRef.value?.getOption(),
  getWidth: () => dataVRef.value ? chartHostRef.value?.clientWidth : echartsRef.value?.getWidth(),
  hideLoading: () => echartsRef.value?.hideLoading(),
  off: (...args: Parameters<EChartsType['off']>) => echartsRef.value?.off(...args),
  on: (...args: Parameters<EChartsType['on']>) => echartsRef.value?.on(...args),
  resize: (options?: ResizeOpts) => scheduleResize(options),
  setConfig: (config: DataVChartsOption, animationEnd = true) => applyDataVConfig(config, animationEnd),
  setOption: (option: EChartsOption | DataVChartsOption, options?: SetOptionOpts | boolean) => {
    if (dataVRef.value)
      dataVRef.value.setOption(option as DataVChartsOption, typeof options === 'boolean' ? options : true)
    else
      echartsRef.value?.setOption(option as EChartsOption, typeof options === 'object' ? options : undefined)
  },
  showLoading: (...args: Parameters<EChartsType['showLoading']>) => echartsRef.value?.showLoading(...args),
})
</script>

<template>
  <div
    ref="rootRef"
    class="luma-charts"
    role="img"
    :aria-label="resolvedAriaLabel"
    :data-renderer="dataVMode ? 'datav' : 'echarts'"
  >
    <div ref="chartHostRef" class="luma-charts__host" />
  </div>
</template>

<style scoped>
.luma-charts,
.luma-charts__host { position: relative; width: 100%; height: 100%; min-width: 0; min-height: 0; }
</style>
