<script setup lang="ts">
import { LumaIcon, LumaIconPicker } from '@luma/core/components'

/***********************模型定义*********************/
const selectedIcon = defineModel<string>({
  default: 'playground:form',
})
</script>

<template>
  <div class="playground-icon-panel">
    <div class="playground-icon-panel__preview">
      <LumaIcon :name="selectedIcon" color="#2563eb" :size="40" />
      <span class="playground-icon-panel__name">
        {{ selectedIcon }}
      </span>
    </div>

    <LumaIconPicker v-model="selectedIcon" />
  </div>
</template>

<style scoped lang="scss">
.playground-icon-panel {
  display: grid;
  gap: 16px;
}

.playground-icon-panel__preview {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding-bottom: 16px;
  border-bottom: 1px solid #e6eaf0;
}

.playground-icon-panel__name {
  min-width: 0;
  overflow: hidden;
  color: #334155;
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
