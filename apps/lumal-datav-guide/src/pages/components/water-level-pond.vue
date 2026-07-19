<script setup lang="ts">
import type { PlaygroundControl } from '@/components/Playground.vue'
import type { PropRow } from '@/components/PropsTable.vue'
import { LumalWaterLevelPond } from '@lumal/datav'
import { reactive } from 'vue'
import ComponentDoc from '@/components/ComponentDoc.vue'
import DemoBlock from '@/components/DemoBlock.vue'
import Playground from '@/components/Playground.vue'
import PropsTable from '@/components/PropsTable.vue'

// 在线调试的属性模型与默认值
const playModel = reactive<Record<string, unknown>>({
  value: 65,
  shape: 'round',
  waveNum: 2,
  waveHeight: 40,
  waveOpacity: 0.4,
  duration: 4000,
  color1: '#00BAFF',
  color2: '#3DE7C9',
})

// 在线调试的控件定义
const playControls: PlaygroundControl[] = [
  { key: 'value', label: '水位 value', type: 'number', min: 0, max: 100, step: 1 },
  { key: 'shape', label: '外形 shape', type: 'select', options: [{ label: 'rect', value: 'rect' }, { label: 'round', value: 'round' }, { label: 'roundRect', value: 'roundRect' }] },
  { key: 'waveNum', label: '波浪数 waveNum', type: 'number', min: 1, max: 8, step: 1 },
  { key: 'waveHeight', label: '波峰高 waveHeight', type: 'number', min: 0, max: 100, step: 5 },
  { key: 'waveOpacity', label: '波浪透明 waveOpacity', type: 'number', min: 0, max: 1, step: 0.05 },
  { key: 'duration', label: '滚动周期 duration', type: 'number', min: 0, max: 8000, step: 200, hint: '毫秒' },
  { key: 'color1', label: '波浪色 colors[0]', type: 'color', omitFromCode: true },
  { key: 'color2', label: '波浪色 colors[1]', type: 'color', omitFromCode: true },
]

const modernCode = `<LumalWaterLevelPond :value="65" shape="round" />
<LumalWaterLevelPond :value="48" shape="roundRect" :colors="['#6ff7cd', '#35c8ff']" />`

const configCode = `<!-- DataV 原生 config：data 为数组，可叠加多层水位 -->
<LumalWaterLevelPond :config="{ data: [55, 42], shape: 'round' }" />`

const propRows: PropRow[] = [
  { name: 'value', type: 'number', default: 'undefined', description: '单一水位百分比（0–100）。' },
  { name: 'data', type: 'number[]', default: 'undefined', description: 'DataV 原生多层水位数组。' },
  { name: 'values', type: 'number[]', default: 'undefined', description: '现代 props：多层水位。' },
  { name: 'config', type: 'WaterLevelPondConfig', default: 'undefined', description: 'DataV 原生配置对象。' },
  { name: 'shape', type: '\'rect\' | \'round\' | \'roundRect\'', default: '\'rect\'', description: '容器外形。' },
  { name: 'colors', type: 'string[]', default: '内置渐变', description: '波浪填充色。' },
  { name: 'waveHeight', type: 'number', default: '按上游', description: '波峰高度。' },
  { name: 'waveNum', type: 'number', default: '按上游', description: '波浪数量。' },
  { name: 'waveOpacity', type: 'number', default: '按上游', description: '波浪透明度。' },
  { name: 'formatter', type: 'string | fn', default: '\'{value}%\'', description: '中心文本格式化。' },
  { name: 'duration', type: 'number', default: '按上游', description: '波浪滚动周期。' },
]
</script>

<template>
  <ComponentDoc
    title="WaterLevelPond 水位球"
    component-name="LumalWaterLevelPond"
    datav-name="waterLevelPond"
    intro="SVG 波浪水位，支持矩形、圆形、圆角矩形三种外形。使用响应式 SVG 波浪与裁剪实现，不依赖 Canvas 运行时。"
  >
    <Playground
      v-model="playModel"
      title="在线调试"
      description="实时修改属性，预览效果与代码同步更新。"
      component-name="LumalWaterLevelPond"
      :controls="playControls"
      :min-height="220"
    >
      <LumalWaterLevelPond
        :value="playModel.value as number"
        :shape="playModel.shape as 'rect' | 'round' | 'roundRect'"
        :wave-num="playModel.waveNum as number"
        :wave-height="playModel.waveHeight as number"
        :wave-opacity="playModel.waveOpacity as number"
        :duration="playModel.duration as number"
        :colors="[playModel.color1 as string, playModel.color2 as string]"
        style="width: 150px; height: 150px;"
      />
    </Playground>

    <DemoBlock
      title="三种外形"
      description="shape 切换 rect / round / roundRect。"
      :code="modernCode"
      :min-height="220"
    >
      <div class="water-row">
        <LumalWaterLevelPond :value="65" shape="round" style="width: 130px; height: 130px;" />
        <LumalWaterLevelPond :value="48" shape="roundRect" :colors="['#6ff7cd', '#35c8ff']" style="width: 120px; height: 150px;" />
        <LumalWaterLevelPond :value="72" shape="rect" style="width: 120px; height: 150px;" />
      </div>
    </DemoBlock>

    <DemoBlock
      title="DataV 原生 config"
      description="data 数组可叠加多层水位。"
      :code="configCode"
      :min-height="200"
    >
      <LumalWaterLevelPond :config="{ data: [55, 42], shape: 'round' }" style="width: 140px; height: 140px;" />
    </DemoBlock>

    <h2>属性</h2>
    <PropsTable :rows="propRows" />
  </ComponentDoc>
</template>

<style scoped>
.water-row {
  display: flex;
  gap: 32px;
  align-items: center;
  justify-content: center;
}
</style>
