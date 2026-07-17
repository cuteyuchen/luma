<script setup lang="ts">
import type { IconDefinition } from '@luma/icons'
import { computed, ref, watch } from 'vue'
import { useIconRegistry } from '../composables/useIconRegistry'
import LumaIcon from './LumaIcon.vue'

const props = withDefaults(defineProps<{
  group?: string
  pageSize?: number
  searchable?: boolean
  showLabels?: boolean
  storageKey?: string
}>(), {
  group: '',
  pageSize: 48,
  searchable: true,
  showLabels: false,
  storageKey: '',
})

const emit = defineEmits<{
  select: [icon: IconDefinition]
}>()

const model = defineModel<string>()
const keyword = ref('')
const activeGroup = ref(props.group)
const page = ref(1)
const effectivePageSize = computed(() => Math.max(1, props.pageSize))
const registry = useIconRegistry()

const icons = registry.icons
const groups = computed(() => {
  const registered = registry.groups.value
  const known = new Set(registered.map(group => group.key))
  const inferred = icons.value
    .map(icon => icon.group)
    .filter((group): group is string => typeof group === 'string' && !known.has(group))
    .filter((group, index, source) => source.indexOf(group) === index)
    .map(group => ({ key: group, label: group }))

  return [...registered, ...inferred]
})
const filteredIcons = computed(() => {
  const search = keyword.value.trim().toLocaleLowerCase()

  return icons.value.filter((icon) => {
    const matchesGroup = !activeGroup.value || icon.group === activeGroup.value
    const matchesSearch = !search
      || icon.key.toLocaleLowerCase().includes(search)
      || icon.label?.toLocaleLowerCase().includes(search)
    return matchesGroup && matchesSearch
  })
})
const totalPages = computed(() => Math.max(1, Math.ceil(filteredIcons.value.length / effectivePageSize.value)))
const pagedIcons = computed(() => {
  const start = (page.value - 1) * effectivePageSize.value
  return filteredIcons.value.slice(start, start + effectivePageSize.value)
})

watch([keyword, activeGroup, effectivePageSize], () => {
  page.value = 1
})

watch(() => props.group, (group) => {
  activeGroup.value = group
})

watch(totalPages, (total) => {
  page.value = Math.min(page.value, total)
})

if (props.storageKey && typeof localStorage !== 'undefined' && !model.value) {
  model.value = localStorage.getItem(props.storageKey) ?? undefined
}

function selectIcon(icon: IconDefinition): void {
  model.value = icon.key
  if (props.storageKey && typeof localStorage !== 'undefined') {
    localStorage.setItem(props.storageKey, icon.key)
  }
  emit('select', icon)
}
</script>

<template>
  <div class="luma-icon-picker">
    <div class="luma-icon-picker__toolbar">
      <label v-if="searchable" class="luma-icon-picker__field">
        <span class="luma-icon-picker__field-label">搜索图标</span>
        <input v-model="keyword" type="search" placeholder="输入名称或 key">
      </label>
      <label v-if="groups.length" class="luma-icon-picker__field">
        <span class="luma-icon-picker__field-label">图标分组</span>
        <select v-model="activeGroup">
          <option value="">全部分组</option>
          <option v-for="groupItem in groups" :key="groupItem.key" :value="groupItem.key">
            {{ groupItem.label }}
          </option>
        </select>
      </label>
    </div>

    <p class="luma-icon-picker__summary" role="status">
      共 {{ filteredIcons.length }} 个图标
    </p>

    <div v-if="pagedIcons.length" class="luma-icon-picker__grid" role="listbox" aria-label="图标列表">
      <button
        v-for="iconItem in pagedIcons"
        :key="iconItem.key"
        class="luma-icon-picker__item"
        :class="{ 'is-selected': model === iconItem.key }"
        type="button"
        role="option"
        :aria-label="iconItem.label || iconItem.key"
        :aria-selected="model === iconItem.key"
        :title="iconItem.label || iconItem.key"
        @click="selectIcon(iconItem)"
      >
        <LumaIcon :name="iconItem.key" />
        <span v-if="showLabels">{{ iconItem.label || iconItem.key }}</span>
      </button>
    </div>
    <p v-else class="luma-icon-picker__empty">
      未找到匹配图标
    </p>

    <footer v-if="totalPages > 1" class="luma-icon-picker__pagination">
      <button type="button" :disabled="page <= 1" @click="page -= 1">
        上一页
      </button>
      <span>第 {{ page }} / {{ totalPages }} 页</span>
      <button type="button" :disabled="page >= totalPages" @click="page += 1">
        下一页
      </button>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.luma-icon-picker {
  display: grid;
  gap: 12px;
}

.luma-icon-picker__toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(140px, 200px);
  gap: 12px;
}

.luma-icon-picker__field {
  display: grid;
  gap: 6px;
}

.luma-icon-picker__field-label,
.luma-icon-picker__summary,
.luma-icon-picker__empty {
  color: var(--el-text-color-secondary, CanvasText);
  font-size: 13px;
}

.luma-icon-picker__field input,
.luma-icon-picker__field select,
.luma-icon-picker__pagination button {
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid var(--el-border-color, currentColor);
  border-radius: var(--luma-radius-base, 8px);
  color: var(--el-text-color-primary, CanvasText);
  background: var(--el-bg-color, Canvas);
}

.luma-icon-picker__summary,
.luma-icon-picker__empty {
  margin: 0;
}

.luma-icon-picker__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(52px, 1fr));
  gap: 8px;
}

.luma-icon-picker__item {
  display: inline-flex;
  min-width: 44px;
  min-height: 52px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  border: 1px solid var(--el-border-color-lighter, currentColor);
  border-radius: var(--luma-radius-small, 6px);
  color: var(--el-text-color-regular, CanvasText);
  background: var(--el-bg-color, Canvas);
  cursor: pointer;
  transition: border-color var(--luma-motion-fast, 160ms), background-color var(--luma-motion-fast, 160ms);
}

.luma-icon-picker__item:hover,
.luma-icon-picker__item.is-selected {
  border-color: var(--el-color-primary, Highlight);
  background: var(--el-color-primary-light-9, Canvas);
}

.luma-icon-picker__item:focus-visible,
.luma-icon-picker__field input:focus-visible,
.luma-icon-picker__field select:focus-visible,
.luma-icon-picker__pagination button:focus-visible {
  outline: 2px solid var(--el-color-primary, Highlight);
  outline-offset: 2px;
}

.luma-icon-picker__item span {
  max-width: 100%;
  overflow: hidden;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.luma-icon-picker__pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.luma-icon-picker__pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

@media (max-width: 640px) {
  .luma-icon-picker__toolbar {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .luma-icon-picker__item {
    transition: none;
  }
}
</style>
