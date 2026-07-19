<script setup lang="ts">
import { LumalIcon } from '@lumal/icons-vue'
import { computed, ref } from 'vue'

/***********************左右区域收起/展开（消费方）*********************/
// 参考 fuyang HideComponent：宽度过渡 + 侧边箭头按钮。

const props = defineProps<{
  side: 'left' | 'right'
}>()

const collapsed = ref(false)

const shellStyle = computed(() => ({
  width: collapsed.value ? '0px' : 'auto',
}))

const expandIcon = computed(() => (
  props.side === 'left'
    ? (collapsed.value ? 'lumal:chevron-right' : 'lumal:chevron-left')
    : (collapsed.value ? 'lumal:chevron-left' : 'lumal:chevron-right')
))

const toggleLabel = computed(() => (
  collapsed.value
    ? (props.side === 'left' ? '展开左侧模块' : '展开右侧模块')
    : (props.side === 'left' ? '收起左侧模块' : '收起右侧模块')
))

function toggle(): void {
  collapsed.value = !collapsed.value
}
</script>

<template>
  <div
    class="region-collapse"
    :class="[`is-${side}`, { 'is-collapsed': collapsed }]"
    :style="shellStyle"
  >
    <div v-show="!collapsed" class="region-collapse__content">
      <slot />
    </div>
    <button
      type="button"
      class="region-collapse__btn"
      :aria-label="toggleLabel"
      :aria-expanded="!collapsed"
      :data-action="`collapse-${side}`"
      @click="toggle"
    >
      <LumalIcon :name="expandIcon" :size="14" />
    </button>
  </div>
</template>

<style scoped>
.region-collapse {
  position: relative;
  height: 100%;
  min-width: 0;
  transition: width 0.45s ease;
}

.region-collapse.is-collapsed {
  overflow: visible;
}

.region-collapse__content {
  height: 100%;
  min-width: 0;
}

.region-collapse__btn {
  position: absolute;
  top: 50%;
  z-index: 5;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 60px;
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--lumal-cockpit-border, rgb(6 183 253 / 50%)), transparent 18%);
  border-radius: 4px;
  background: color-mix(in srgb, var(--lumal-cockpit-floating-bg, #19374b), transparent 8%);
  color: var(--lumal-cockpit-text-secondary, #a8b7c8);
  cursor: pointer;
  transform: translateY(-50%);
  box-shadow: 0 0 12px color-mix(in srgb, var(--lumal-cockpit-accent, #00cbf4), transparent 78%);
}

.region-collapse.is-left .region-collapse__btn {
  right: -25px;
}

.region-collapse.is-right .region-collapse__btn {
  left: -25px;
}

.region-collapse.is-collapsed.is-left .region-collapse__btn {
  right: auto;
  left: 0;
}

.region-collapse.is-collapsed.is-right .region-collapse__btn {
  left: auto;
  right: 0;
}

.region-collapse__btn:hover {
  border-color: var(--lumal-cockpit-accent, #00cbf4);
  color: var(--lumal-cockpit-title-text, #fff);
  background: color-mix(in srgb, var(--lumal-cockpit-accent, #00cbf4), transparent 84%);
}

.region-collapse__btn:focus-visible {
  outline: 2px solid var(--lumal-cockpit-focus-ring, #409eff);
  outline-offset: 2px;
}
</style>
