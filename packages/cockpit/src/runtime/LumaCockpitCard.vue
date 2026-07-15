<script setup lang="ts">
import type { CockpitWidgetInstance } from '../types'
import type { CockpitCardProps, CockpitCardTab } from './card'
import { computed, nextTick, useId, watch } from 'vue'

/***********************统一模块 Card*********************/

const props = withDefaults(defineProps<CockpitCardProps>(), {
  tabs: () => [],
})

const emit = defineEmits<{
  'update:activeTabId': [activeTabId: string]
}>()

defineSlots<{
  default?: (props: { activeTabId: string | undefined }) => unknown
  title?: (props: { title: string | undefined, widget: CockpitWidgetInstance | undefined }) => unknown
  tab?: (props: { tab: CockpitCardTab, active: boolean }) => unknown
}>()

const cardId = useId()
const tabButtons = new Map<string, HTMLButtonElement>()
const hasTabs = computed(() => props.tabs.length > 1)
const singleTab = computed(() => props.tabs[0])
const resolvedActiveTabId = computed(() => {
  const requested = props.activeTabId
  return props.tabs.some(tab => tab.id === requested) ? requested : props.tabs[0]?.id
})
const displayWidget = computed(() => props.widget ?? singleTab.value?.widget)
const displayTitle = computed(() => (
  props.title
  ?? props.widget?.title
  ?? singleTab.value?.title
  ?? displayWidget.value?.title
  ?? displayWidget.value?.type
))
const tabpanelId = `${cardId}-tabpanel`

function tabId(index: number): string {
  return `${cardId}-tab-${index}`
}

function setTabButton(id: string, element: unknown): void {
  if (element instanceof HTMLButtonElement)
    tabButtons.set(id, element)
  else
    tabButtons.delete(id)
}

function selectTab(id: string): void {
  if (id !== resolvedActiveTabId.value)
    emit('update:activeTabId', id)
}

function onTabKeydown(event: KeyboardEvent, index: number): void {
  if (!props.tabs.length)
    return

  const targetByKey: Record<string, number> = {
    ArrowRight: (index + 1) % props.tabs.length,
    ArrowDown: (index + 1) % props.tabs.length,
    ArrowLeft: (index - 1 + props.tabs.length) % props.tabs.length,
    ArrowUp: (index - 1 + props.tabs.length) % props.tabs.length,
    Home: 0,
    End: props.tabs.length - 1,
  }
  const targetIndex = targetByKey[event.key]
  const target = props.tabs[targetIndex]
  if (!target)
    return

  event.preventDefault()
  selectTab(target.id)
  void nextTick(() => tabButtons.get(target.id)?.focus())
}

watch(
  () => [props.activeTabId, props.tabs.map(tab => tab.id).join(',')],
  () => {
    const fallback = resolvedActiveTabId.value
    if (hasTabs.value && fallback && fallback !== props.activeTabId)
      emit('update:activeTabId', fallback)
  },
  { immediate: true },
)
</script>

<template>
  <section class="luma-cockpit-card" :class="{ 'is-tabs': hasTabs }">
    <header v-if="hasTabs" class="luma-cockpit-card__header">
      <div class="luma-cockpit-card__tablist" role="tablist" aria-label="模块切换">
        <button
          v-for="(tab, index) in tabs"
          :id="tabId(index)"
          :key="tab.id"
          :ref="element => setTabButton(tab.id, element)"
          type="button"
          role="tab"
          class="luma-cockpit-card__tab"
          :class="{ 'is-active': tab.id === resolvedActiveTabId }"
          :aria-controls="tabpanelId"
          :aria-selected="tab.id === resolvedActiveTabId"
          :tabindex="tab.id === resolvedActiveTabId ? 0 : -1"
          @click="selectTab(tab.id)"
          @keydown="onTabKeydown($event, index)"
        >
          <slot name="tab" :tab="tab" :active="tab.id === resolvedActiveTabId">
            {{ tab.title }}
          </slot>
        </button>
      </div>
    </header>

    <header v-else-if="displayTitle || $slots.title" class="luma-cockpit-card__header">
      <div class="luma-cockpit-card__title">
        <slot name="title" :title="displayTitle" :widget="displayWidget">
          {{ displayTitle }}
        </slot>
      </div>
    </header>

    <div
      :id="hasTabs ? tabpanelId : undefined"
      class="luma-cockpit-card__body"
      :role="hasTabs ? 'tabpanel' : undefined"
      :aria-labelledby="hasTabs ? tabId(Math.max(0, tabs.findIndex(tab => tab.id === resolvedActiveTabId))) : undefined"
      :tabindex="hasTabs ? 0 : undefined"
    >
      <slot :active-tab-id="resolvedActiveTabId" />
    </div>
  </section>
</template>
