<script setup lang="ts">
import type { LumaPreferences } from '@luma/core/theme'
import { LumaThemeSettingsPanel } from '@luma/core/theme'
import { ElDrawer } from 'element-plus'
import { computed } from 'vue'

/***********************属性定义*********************/
const props = withDefaults(defineProps<{
  preferences: LumaPreferences
  visible?: boolean
}>(), {
  visible: false,
})

const emit = defineEmits<{
  'change': [preferences: LumaPreferences]
  'update:preferences': [preferences: LumaPreferences]
  'update:visible': [visible: boolean]
}>()

/***********************双向绑定代理*********************/
const visibleModel = computed({
  get: () => props.visible,
  set: visible => emit('update:visible', visible),
})

/***********************事件处理*********************/
function handleChange(nextPreferences: LumaPreferences): void {
  emit('change', nextPreferences)
}

function handlePreferencesUpdate(nextPreferences: LumaPreferences): void {
  emit('update:preferences', nextPreferences)
}
</script>

<template>
  <ElDrawer
    v-model="visibleModel"
    title="主题与布局设置"
    size="420px"
    destroy-on-close
  >
    <LumaThemeSettingsPanel
      :preferences="preferences"
      @change="handleChange"
      @update:preferences="handlePreferencesUpdate"
    />
  </ElDrawer>
</template>
