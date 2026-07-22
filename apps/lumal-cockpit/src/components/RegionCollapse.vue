<script setup lang="ts">
import { LumalIcon } from '@lumal/icons-vue'
import { computed, ref } from 'vue'

/***********************左右区域收起/展开（消费方）*********************/

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
      <LumalIcon :name="expandIcon" :size="15" />
    </button>
  </div>
</template>

<style scoped>
.region-collapse {
  position: relative;
  height: 100%;
  min-width: 0;
  transition: width 320ms cubic-bezier(0.22, 1, 0.36, 1);
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
  z-index: 8;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 56px;
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--lumal-cockpit-border), transparent 18%);
  border-radius: 12px;
  background: color-mix(in srgb, var(--lumal-cockpit-floating-bg), transparent 12%);
  color: var(--lumal-cockpit-text-muted);
  cursor: pointer;
  opacity: 0.68;
  transform: translateY(-50%);
  box-shadow:
    0 10px 24px rgb(0 0 0 / 18%),
    inset 0 1px 0 rgb(255 255 255 / 4%);
  backdrop-filter: blur(12px);
  transition: opacity 160ms ease, color 160ms ease, border-color 160ms ease, background-color 160ms ease, transform 160ms ease;
}

.region-collapse.is-left .region-collapse__btn {
  right: -36px;
}

.region-collapse.is-right .region-collapse__btn {
  left: -36px;
}

.region-collapse.is-collapsed.is-left .region-collapse__btn {
  right: auto;
  left: 4px;
}

.region-collapse.is-collapsed.is-right .region-collapse__btn {
  right: 4px;
  left: auto;
}

.region-collapse__btn:hover {
  border-color: color-mix(in srgb, var(--lumal-cockpit-accent), transparent 46%);
  background: color-mix(in srgb, var(--lumal-cockpit-accent), transparent 91%);
  color: var(--lumal-cockpit-title-text);
  opacity: 1;
  transform: translateY(-50%) scale(1.03);
}

.region-collapse__btn:focus-visible {
  outline: 2px solid var(--lumal-cockpit-focus-ring);
  outline-offset: 2px;
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .region-collapse,
  .region-collapse__btn {
    transition: none;
  }
}
</style>
