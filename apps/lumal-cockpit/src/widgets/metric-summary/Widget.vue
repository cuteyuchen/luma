<script setup lang="ts">
import { LumalDigitalFlop, LumalPercentPond } from '@lumal/datav'
import { computed } from 'vue'
import WidgetState from '../../components/WidgetState.vue'
import { useDemoRefresh } from '../../composables/useDemoRefresh'
import { metricSummaries } from '../../data/demo-scene'

/***********************核心运行指标模块*********************/
const { loading } = useDemoRefresh()
const error = ''
const items = computed(() => metricSummaries)
</script>

<template>
  <div class="metric-summary">
    <WidgetState :loading="loading" :error="error" :empty="items.length === 0" />
    <dl v-if="!loading && !error && items.length > 0" class="metric-summary__grid">
      <div
        v-for="(item, index) in items"
        :key="item.label"
        class="metric-summary__item"
        :data-tone="item.tone"
      >
        <dt class="metric-summary__heading">
          <span>{{ item.label }}</span>
          <span>0{{ index + 1 }}</span>
        </dt>
        <dd class="metric-summary__value">
          <span v-if="item.visual === 'percent'" class="metric-summary__pond-value">
            <LumalPercentPond
              :value="item.value"
              :colors="['var(--metric-tone)', 'var(--lumal-cockpit-accent)']"
              :aria-label="`${item.label} ${item.value}%`"
            />
          </span>
          <LumalDigitalFlop v-else :value="item.value" :duration="420" />
          <span>{{ item.unit }}</span>
        </dd>
        <dd class="metric-summary__trend">
          {{ item.trend }}
        </dd>
      </div>
    </dl>
  </div>
</template>

<style scoped>
.metric-summary {
  height: 100%;
}

.metric-summary__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  height: 100%;
  margin: 0;
}

.metric-summary__item {
  --metric-tone: var(--lumal-cockpit-accent);

  position: relative;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  min-width: 0;
  min-height: 86px;
  padding: 12px 13px 11px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--lumal-cockpit-border), transparent 18%);
  border-radius: 10px;
  background:
    radial-gradient(circle at 100% 100%, color-mix(in srgb, var(--metric-tone), transparent 92%), transparent 52%),
    color-mix(in srgb, var(--lumal-cockpit-floating-bg), transparent 18%);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 3%);
}

.metric-summary__item::before {
  position: absolute;
  top: 11px;
  bottom: 11px;
  left: 0;
  width: 3px;
  border-radius: 0 999px 999px 0;
  background: var(--metric-tone);
  content: '';
  opacity: 0.88;
}

.metric-summary__item[data-tone='green'] {
  --metric-tone: var(--lumal-cockpit-success);
}

.metric-summary__item[data-tone='amber'] {
  --metric-tone: var(--lumal-cockpit-warning);
}

.metric-summary__item[data-tone='blue'] {
  --metric-tone: #6f8cff;
}

.metric-summary__heading,
.metric-summary__value {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.metric-summary__heading > span:first-child {
  color: var(--lumal-cockpit-text-secondary);
  font-size: 11px;
  font-weight: 600;
}

.metric-summary__heading span:last-child {
  color: color-mix(in srgb, var(--metric-tone), transparent 42%);
  font-size: 9px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.11em;
}

.metric-summary__value {
  align-items: end;
  justify-content: flex-start;
  margin: 5px 0 0;
  color: var(--metric-tone);
  font-size: 29px;
  font-weight: 720;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.metric-summary__pond-value {
  width: min(100%, 142px);
  min-width: 0;
  font-size: 12px !important;
}

.metric-summary__pond-value :deep(.lumal-percent-pond) {
  width: 100%;
}

.metric-summary__value > span:last-child {
  margin-bottom: 2px;
  color: var(--lumal-cockpit-text-muted);
  font-size: 10px;
  font-weight: 500;
}

.metric-summary__trend {
  margin: 5px 0 0;
  color: var(--lumal-cockpit-text-muted);
  font-size: 10px;
}
</style>
