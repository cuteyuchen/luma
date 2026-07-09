<script setup lang="ts">
import LumaIconPicker from './LumaIconPicker.vue'

/***********************模型定义*********************/
const visible = defineModel<boolean>('visible', { default: false })
const iconValue = defineModel<string>()
</script>

<template>
  <div v-if="visible" class="luma-icon-picker-dialog">
    <div class="luma-icon-picker-dialog__body">
      <LumaIconPicker v-model="iconValue" />
    </div>
  </div>
</template>
