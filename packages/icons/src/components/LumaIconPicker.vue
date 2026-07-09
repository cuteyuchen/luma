<script setup lang="ts">
import type { IconDefinition } from '../types'
import { computed } from 'vue'
import { getRegisteredIconDefinitions } from '../registry/icons'
import LumaIcon from './LumaIcon.vue'

/***********************模型定义*********************/
const model = defineModel<string>()

/***********************图标列表*********************/
const icons = computed<IconDefinition[]>(() => getRegisteredIconDefinitions())
</script>

<template>
  <div class="luma-icon-picker">
    <button
      v-for="iconItem in icons"
      :key="iconItem.key"
      class="luma-icon-picker__item"
      type="button"
      :title="iconItem.label"
      @click="model = iconItem.key"
    >
      <LumaIcon :name="iconItem.key" />
    </button>
  </div>
</template>
