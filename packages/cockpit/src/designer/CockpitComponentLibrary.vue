<script setup lang="ts">
import type { CockpitRegistry, CockpitWidgetDefinition } from '../registry/types'
import { LumaIcon } from '@luma/icons'
import Sortable from 'sortablejs'
import { ElButton, ElEmpty } from 'element-plus'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

/***********************Designer 模块库*********************/

const props = defineProps<{ registry: CockpitRegistry, selectedType?: string }>()
const emit = defineEmits<{ selectWidget: [widget: CockpitWidgetDefinition] }>()
const libraryRef = ref<HTMLElement | null>(null)
let sortable: Sortable | undefined

const widgets = computed(() => props.registry.listWidgets())

onMounted(() => {
  if (!libraryRef.value)
    return
  sortable = Sortable.create(libraryRef.value, {
    animation: 160,
    group: { name: 'luma-cockpit-designer-modules', pull: 'clone', put: false },
    sort: false,
    draggable: '.luma-cockpit-designer__library-card',
  })
})

onBeforeUnmount(() => {
  sortable?.destroy()
})
</script>

<template>
  <aside class="luma-cockpit-designer__library" aria-label="模块库">
    <header class="luma-cockpit-designer__library-title">
      <div>
        <strong>模块</strong>
        <span>{{ widgets.length }} 个可用模块</span>
      </div>
    </header>
    <div ref="libraryRef" class="luma-cockpit-designer__library-grid">
      <ElButton
        v-for="widget in widgets"
        :key="widget.type"
        class="luma-cockpit-designer__library-card"
        :class="{ 'is-selected': selectedType === widget.type }"
        :data-cockpit-library-type="widget.type"
        :data-cockpit-library-title="widget.label"
        :aria-label="`选择或拖动模块：${widget.label}`"
        :aria-pressed="selectedType === widget.type"
        @click="emit('selectWidget', widget)"
      >
        <img v-if="widget.thumbnail" :src="widget.thumbnail" alt="" class="luma-cockpit-designer__library-thumbnail">
        <span v-else class="luma-cockpit-designer__library-icon" aria-hidden="true">
          <LumaIcon :name="widget.icon || 'luma:grid'" :size="24" />
        </span>
        <span class="luma-cockpit-designer__library-label">{{ widget.label }}</span>
      </ElButton>
      <ElEmpty v-if="!widgets.length" class="luma-cockpit-designer__library-empty" description="暂无可用模块" :image-size="56" />
    </div>
  </aside>
</template>
