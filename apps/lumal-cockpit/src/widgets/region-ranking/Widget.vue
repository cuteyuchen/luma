<script setup lang="ts">
import type { SceneRegion, SceneStatus } from '../../data/demo-scene'
import type { SceneSelectionPayload } from '../../messages/topics'
import { useCockpitContext } from '@lumal/cockpit'
import { LumalScrollRankingBoard } from '@lumal/datav'
import { computed, nextTick, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue'
import WidgetState from '../../components/WidgetState.vue'
import { useDemoRefresh } from '../../composables/useDemoRefresh'
import { demoScene, getSceneEntity } from '../../data/demo-scene'
import { cockpitTopics } from '../../messages/topics'

/***********************区域运行指数模块*********************/
const context = useCockpitContext()
const { loading } = useDemoRefresh()
const error = ''
const selectedId = ref('')
const root = useTemplateRef<HTMLElement>('root')
const regions = computed(() =>
  [...demoScene.regions]
    .sort((a, b) => b.value - a.value)
    .map(region => ({ ...region, key: region.id, label: region.name })),
)
const statusLabels: Record<SceneStatus, string> = {
  stable: '平稳',
  active: '高载',
  watch: '关注',
}
const activeRegionId = computed(() => {
  const entity = getSceneEntity(selectedId.value)
  return entity?.kind === 'point' ? entity.regionId : entity?.id
})

function regionItem(item: unknown): SceneRegion & { key: string, label: string } {
  return item as SceneRegion & { key: string, label: string }
}

function selectRegion(id: string): void {
  context.messages.publish({
    topic: cockpitTopics.sceneRegionFocus,
    sourceId: context.instanceId,
    payload: { id },
  })
}

const unsubscribeSelection = context.messages.subscribe<SceneSelectionPayload>(
  cockpitTopics.sceneSelectionChange,
  (message) => {
    selectedId.value = message.payload?.ids[0] ?? ''
  },
)

watch(activeRegionId, async (id) => {
  await nextTick()
  if (!id)
    return
  root.value
    ?.querySelector<HTMLButtonElement>(`button[data-region-id="${id}"]`)
    ?.scrollIntoView({ block: 'nearest' })
})

onBeforeUnmount(unsubscribeSelection)
</script>

<template>
  <div ref="root" class="region-ranking">
    <WidgetState :loading="loading" :error="error" :empty="regions.length === 0" />
    <div v-if="!loading && !error && regions.length > 0" class="region-ranking__table">
      <div class="region-ranking__head" aria-hidden="true">
        <span>排名</span>
        <span>区域</span>
        <span>状态</span>
        <span>指数</span>
      </div>
      <LumalScrollRankingBoard
        class="region-ranking__scroll"
        :items="regions"
        :visible-rows="5"
        :interval="3000"
        aria-label="区域运行指数自动滚动排名"
      >
        <template #default="{ item, index, ratio }">
          <button
            type="button"
            :class="{ 'is-active': activeRegionId === regionItem(item).id, 'is-top': index < 3 }"
            :data-region-id="regionItem(item).id"
            :data-status="regionItem(item).status"
            :aria-pressed="activeRegionId === regionItem(item).id"
            @click="selectRegion(regionItem(item).id)"
          >
            <span class="region-ranking__index">{{ index + 1 }}</span>
            <span class="region-ranking__name">{{ regionItem(item).name }}</span>
            <span class="region-ranking__status">{{ statusLabels[regionItem(item).status] }}</span>
            <span class="region-ranking__value">{{ regionItem(item).value }}</span>
            <span class="region-ranking__bar" aria-hidden="true">
              <span :style="{ width: `${ratio * 100}%` }" />
            </span>
          </button>
        </template>
      </LumalScrollRankingBoard>
    </div>
  </div>
</template>

<style scoped>
.region-ranking,
.region-ranking__table {
  height: 100%;
  min-height: 0;
}

.region-ranking__table {
  display: grid;
  grid-template-rows: 32px minmax(0, 1fr);
  gap: 7px;
}

.region-ranking__head,
.region-ranking__scroll :deep(button) {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) 52px 46px;
  align-items: center;
  gap: 8px;
}

.region-ranking__head {
  padding: 0 10px;
  border-bottom: 1px solid color-mix(in srgb, var(--lumal-cockpit-border), transparent 30%);
  color: var(--lumal-cockpit-text-muted);
  font-size: 10px;
  font-weight: 600;
}

.region-ranking__head span:last-child {
  text-align: right;
}

.region-ranking__scroll {
  min-height: 0;
}

.region-ranking__scroll :deep(button) {
  position: relative;
  width: 100%;
  min-height: 44px;
  padding: 7px 10px 10px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--lumal-cockpit-border), transparent 12%);
  border-radius: 9px;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--lumal-cockpit-accent), transparent 97%), transparent 54%),
    color-mix(in srgb, var(--lumal-cockpit-floating-bg), transparent 20%);
  color: inherit;
  cursor: pointer;
  transition: border-color 160ms ease, background-color 160ms ease, transform 160ms ease;
}

.region-ranking__scroll :deep(button:hover) {
  border-color: color-mix(in srgb, var(--lumal-cockpit-accent), transparent 58%);
  transform: translateX(1px);
}

.region-ranking__scroll :deep(button.is-active) {
  border-color: color-mix(in srgb, var(--lumal-cockpit-accent), transparent 46%);
  background: color-mix(in srgb, var(--lumal-cockpit-selected), transparent 12%);
  box-shadow: inset 3px 0 0 var(--lumal-cockpit-accent);
}

.region-ranking__scroll :deep(button:focus-visible) {
  outline: 2px solid var(--lumal-cockpit-focus-ring);
  outline-offset: -2px;
}

.region-ranking__index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: 1px solid color-mix(in srgb, var(--lumal-cockpit-accent), transparent 58%);
  border-radius: 8px;
  background: color-mix(in srgb, var(--lumal-cockpit-accent), transparent 93%);
  color: var(--lumal-cockpit-accent);
  font-size: 10px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.region-ranking__scroll :deep(button.is-top) .region-ranking__index {
  border-color: color-mix(in srgb, var(--lumal-cockpit-warning), transparent 46%);
  background: color-mix(in srgb, var(--lumal-cockpit-warning), transparent 92%);
  color: var(--lumal-cockpit-warning);
}

.region-ranking__name {
  overflow: hidden;
  color: var(--lumal-cockpit-text);
  font-size: 11px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.region-ranking__status {
  color: var(--lumal-cockpit-text-secondary);
  font-size: 10px;
  text-align: center;
}

button[data-status='active'] .region-ranking__status {
  color: var(--lumal-cockpit-success);
}

button[data-status='watch'] .region-ranking__status {
  color: var(--lumal-cockpit-warning);
}

.region-ranking__value {
  color: var(--lumal-cockpit-title-text);
  font-size: 13px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.region-ranking__bar {
  position: absolute;
  right: 10px;
  bottom: 5px;
  left: 54px;
  height: 2px;
  overflow: hidden;
  border-radius: 999px;
  background: color-mix(in srgb, var(--lumal-cockpit-accent), transparent 92%);
}

.region-ranking__bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--lumal-cockpit-accent), color-mix(in srgb, var(--lumal-cockpit-accent), transparent 52%));
}
</style>
