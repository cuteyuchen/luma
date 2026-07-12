<script setup lang="ts">
import { computed } from 'vue'
import { demoScene } from '../../data/demo-scene'
import { cockpitTopics } from '../../messages/topics'
import { useCockpitContext } from '@luma/cockpit'

/***********************区域排名模块*********************/

const context = useCockpitContext()
const loading = false
const error = ''
const regions = computed(() =>
  [...demoScene.regions].sort((a, b) => b.value - a.value),
)

function selectRegion(id: string): void {
  context.messages.publish({
    topic: cockpitTopics.sceneRegionFocus,
    sourceId: context.instanceId,
    payload: { id },
  })
  context.messages.publish({
    topic: cockpitTopics.sceneSelectionChange,
    sourceId: context.instanceId,
    payload: { ids: [id] },
  })
}
</script>

<template>
  <div class="region-ranking">
    <div v-if="loading" class="region-ranking__state" role="status">
      加载中
    </div>
    <div v-else-if="error" class="region-ranking__state" role="alert">
      {{ error }}
    </div>
    <div v-else-if="regions.length === 0" class="region-ranking__state" role="status">
      暂无数据
    </div>
    <ol v-else class="region-ranking__items">
      <li v-for="(item, index) in regions" :key="item.id">
        <button type="button" @click="selectRegion(item.id)">
          <span class="region-ranking__index">{{ index + 1 }}</span>
          <span class="region-ranking__name">{{ item.name }}</span>
          <span class="region-ranking__value">{{ item.value }}</span>
        </button>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.region-ranking {
  height: 100%;
  padding: 12px;
}

.region-ranking__items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.region-ranking__items button {
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr) 48px;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 44px;
  padding: 8px 10px;
  border: 1px solid var(--luma-cockpit-border);
  border-radius: var(--luma-cockpit-radius);
  background: var(--luma-cockpit-floating-bg);
  color: inherit;
  cursor: pointer;
}

.region-ranking__index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 999px;
  background: var(--luma-cockpit-selected);
  color: var(--luma-cockpit-accent);
  font-size: 12px;
  font-weight: 700;
}

.region-ranking__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.region-ranking__value {
  color: var(--luma-cockpit-title-text);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.region-ranking__state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--luma-cockpit-text-secondary);
}
</style>
