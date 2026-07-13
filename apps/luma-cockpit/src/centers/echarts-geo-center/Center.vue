<script setup lang="ts">
import type { EChartsOption, SetOptionOpts } from 'echarts'
import type { ComponentPublicInstance } from 'vue'
import type { SceneFilterPayload, SceneFocusPayload, SceneSelectionPayload } from '../../messages/topics'
import { useChartResize } from '@luma/charts'
import type { CockpitCenterContext } from '@luma/cockpit'
import { LinesChart, MapChart, ScatterChart, EffectScatterChart } from 'echarts/charts'
import { GeoComponent, TooltipComponent, VisualMapComponent } from 'echarts/components'
import { registerMap, use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, useTemplateRef } from 'vue'
import { demoScene } from '../../data/demo-scene'
import { cockpitTopics } from '../../messages/topics'

/***********************ECharts GeoJSON 中央组件*********************/

const MAP_NAME = 'luma-demo-scene'

use([
  CanvasRenderer,
  GeoComponent,
  TooltipComponent,
  VisualMapComponent,
  MapChart,
  ScatterChart,
  EffectScatterChart,
  LinesChart,
])
registerMap(MAP_NAME, demoScene.geoJson as never)

const props = defineProps<{ context: CockpitCenterContext }>()
const context = props.context
const chartRef = useTemplateRef<ComponentPublicInstance & { resize: () => void }>('chartRef')

const selectedIds = ref<string[]>([...demoScene.selectedIds])
const focusedId = ref<string>('')
const filterStatus = ref<string | undefined>()
const resolvedTheme = shallowRef<'light' | 'dark'>('dark')
const renderChart = shallowRef(false)
const updateOptions: SetOptionOpts = { notMerge: false }

function syncTheme(): void {
  resolvedTheme.value = document.documentElement.dataset.lumaTheme === 'light' ? 'light' : 'dark'
}

const isDark = computed(() => resolvedTheme.value === 'dark')
const regionByName = computed(() => new Map(demoScene.regions.map(item => [item.name, item])))

function isSelected(id: string): boolean {
  return selectedIds.value.includes(id) || focusedId.value === id
}

function statusOpacity(status?: string): number {
  return !filterStatus.value || filterStatus.value === status ? 1 : 0.28
}

const option = computed<EChartsOption>(() => {
  const accent = isDark.value ? '#4ea8ff' : '#1d4ed8'
  const baseArea = isDark.value ? '#17283d' : '#dbe8f7'
  const border = isDark.value ? '#5f8fc7' : '#7aa5d8'
  const text = isDark.value ? '#e5edf7' : '#25364a'
  const selected = isDark.value ? '#3b82f6' : '#60a5fa'

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      confine: true,
      backgroundColor: isDark.value ? 'rgba(11, 21, 36, 0.92)' : 'rgba(255, 255, 255, 0.96)',
      borderColor: isDark.value ? 'rgba(120, 170, 230, 0.36)' : 'rgba(86, 130, 185, 0.28)',
      textStyle: { color: text },
      formatter(params: unknown) {
        const item = params as { data?: { name?: string, value?: number | number[] }, name?: string }
        const value = Array.isArray(item.data?.value) ? item.data.value[2] : item.data?.value
        return `${item.data?.name ?? item.name ?? ''}<br/>值：${value ?? '-'}`
      },
    },
    visualMap: {
      show: false,
      min: 0,
      max: 100,
      inRange: { color: [baseArea, selected] },
    },
    geo: {
      map: MAP_NAME,
      roam: true,
      zoom: 1.08,
      center: [55, 0],
      itemStyle: {
        areaColor: baseArea,
        borderColor: border,
        borderWidth: 1,
      },
      emphasis: {
        itemStyle: {
          areaColor: selected,
          borderColor: accent,
        },
        label: {
          color: text,
        },
      },
      label: {
        show: true,
        color: isDark.value ? 'rgba(229, 237, 247, 0.68)' : 'rgba(37, 54, 74, 0.72)',
        fontSize: 12,
      },
    },
    series: [
      {
        name: '区域',
        type: 'map',
        map: MAP_NAME,
        geoIndex: 0,
        selectedMode: 'multiple',
        data: demoScene.regions.map(region => ({
          id: region.id,
          name: region.name,
          value: region.value,
          itemStyle: {
            areaColor: isSelected(region.id) ? selected : baseArea,
            opacity: statusOpacity(region.status),
          },
        })),
      },
      {
        name: '节点',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        symbolSize(value: unknown) {
          const numeric = Array.isArray(value) ? Number(value[2]) : 60
          return Math.max(10, Math.min(18, numeric / 5))
        },
        rippleEffect: {
          brushType: 'stroke',
          scale: 2.6,
        },
        itemStyle: {
          color: isDark.value ? '#fbbf24' : '#d97706',
          shadowBlur: 10,
          shadowColor: isDark.value ? 'rgba(251, 191, 36, 0.38)' : 'rgba(217, 119, 6, 0.28)',
        },
        emphasis: {
          itemStyle: { color: '#22c55e' },
        },
        data: demoScene.points.map(point => ({
          id: point.id,
          name: point.name,
          value: [...point.coordinate, point.value],
          itemStyle: {
            color: isSelected(point.id) ? '#22c55e' : undefined,
            opacity: statusOpacity(point.status),
          },
        })),
      },
      {
        name: '连接',
        type: 'lines',
        coordinateSystem: 'geo',
        silent: true,
        lineStyle: {
          color: accent,
          opacity: isDark.value ? 0.28 : 0.22,
          width: 1.2,
          curveness: 0.18,
        },
        data: demoScene.lines?.map(line => ({
          coords: [line.from, line.to],
          value: line.value,
        })) ?? [],
      },
    ],
  }
})

function publishSelection(ids: string[]): void {
  selectedIds.value = ids
  context.messages.publish<SceneSelectionPayload>({
    topic: cockpitTopics.sceneSelectionChange,
    sourceId: context.instanceId,
    payload: { ids },
  })
}

function handleChartClick(params: unknown): void {
  const event = params as { data?: { id?: string } | null, name?: string }
  const region = event.name ? regionByName.value.get(event.name) : undefined
  const data = event.data
  const id = data?.id ?? region?.id
  if (!id)
    return
  focusedId.value = id
  publishSelection([id])
}

const unsubscribeSelection = context.messages.subscribe<SceneSelectionPayload>(
  cockpitTopics.sceneSelectionChange,
  (message) => {
    selectedIds.value = message.payload?.ids ?? []
  },
)

const unsubscribeRegionFocus = context.messages.subscribe<SceneFocusPayload>(
  cockpitTopics.sceneRegionFocus,
  (message) => {
    focusedId.value = message.payload?.id ?? ''
    if (focusedId.value)
      publishSelection([focusedId.value])
  },
)

const unsubscribePointFocus = context.messages.subscribe<SceneFocusPayload>(
  cockpitTopics.scenePointFocus,
  (message) => {
    focusedId.value = message.payload?.id ?? ''
    if (focusedId.value)
      publishSelection([focusedId.value])
  },
)

const unsubscribeFilter = context.messages.subscribe<SceneFilterPayload>(
  cockpitTopics.sceneFilterChange,
  (message) => {
    filterStatus.value = message.payload?.status
  },
)

let themeObserver: MutationObserver | undefined

onMounted(() => {
  syncTheme()
  themeObserver = new MutationObserver(syncTheme)
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-luma-theme'],
  })
  renderChart.value = true
  context.messages.publish({
    topic: cockpitTopics.centerReady,
    sourceId: context.instanceId,
  })
})

onBeforeUnmount(() => {
  unsubscribeSelection()
  unsubscribeRegionFocus()
  unsubscribePointFocus()
  unsubscribeFilter()
  themeObserver?.disconnect()
})

useChartResize(chartRef)
</script>

<template>
  <div class="echarts-geo-center">
    <VChart
      v-if="renderChart"
      ref="chartRef"
      class="echarts-geo-center__chart"
      :option="option"
      :update-options="updateOptions"
      autoresize
      @click="handleChartClick"
    />
  </div>
</template>

<style scoped>
.echarts-geo-center {
  width: 100%;
  height: 100%;
  min-height: 0;
}

.echarts-geo-center__chart {
  width: 100%;
  height: 100%;
}
</style>
