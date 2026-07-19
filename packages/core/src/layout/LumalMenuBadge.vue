<script setup lang="ts">
import type { LumalMenuBadgeTone, LumalMenuBadgeType } from './types'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  badge?: number | string
  label?: string
  tone?: LumalMenuBadgeTone
  type?: LumalMenuBadgeType
}>(), {
  badge: '',
  label: '菜单',
  tone: 'primary',
  type: 'text',
})

const visible = computed(() => props.type === 'dot' || props.badge === 0 || Boolean(props.badge))
const accessibleLabel = computed(() => props.type === 'dot'
  ? `${props.label}有新内容`
  : `${props.label}：${props.badge}`)
</script>

<template>
  <span
    v-if="visible"
    class="lumal-menu-badge"
    :class="[`is-${tone}`, { 'is-dot': type === 'dot' }]"
    role="status"
    :aria-label="accessibleLabel"
  >
    <span v-if="type === 'text'" aria-hidden="true">{{ badge }}</span>
  </span>
</template>

<style scoped lang="scss">
.lumal-menu-badge {
  --lumal-menu-badge-color: var(--el-color-primary);

  display: inline-flex;
  min-width: 18px;
  height: 18px;
  align-items: center;
  justify-content: center;
  flex: none;
  padding: 0 5px;
  border-radius: 9px;
  color: var(--el-color-white);
  background: var(--lumal-menu-badge-color);
  font-size: calc(var(--lumal-font-size-base, 14px) - 3px);
  font-variant-numeric: tabular-nums;
  line-height: 18px;
}

.lumal-menu-badge.is-dot {
  width: 8px;
  min-width: 8px;
  height: 8px;
  padding: 0;
}

.lumal-menu-badge.is-success { --lumal-menu-badge-color: var(--el-color-success); }
.lumal-menu-badge.is-warning { --lumal-menu-badge-color: var(--el-color-warning); }
.lumal-menu-badge.is-danger { --lumal-menu-badge-color: var(--el-color-danger); }
.lumal-menu-badge.is-info { --lumal-menu-badge-color: var(--el-color-info); }
</style>
