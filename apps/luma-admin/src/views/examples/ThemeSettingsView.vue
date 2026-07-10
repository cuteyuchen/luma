<script setup lang="ts">
import type { LumaPreferences } from '@luma/core/theme'
import { LumaInfoTable, LumaPage } from '@luma/core/components'
import {
  createDefaultPreferences,
  LumaThemeSettingsPanel,
  resolveThemeMode,
} from '@luma/core/theme'
import { computed, shallowRef } from 'vue'

/***********************偏好状态*********************/
const preferences = shallowRef<LumaPreferences>(createDefaultPreferences())

const resolvedMode = computed(() => resolveThemeMode(preferences.value.theme.mode, {
  matchMedia: query => ({
    matches: query.includes('dark'),
  }) as MediaQueryList,
}))

const preferenceItems = computed(() => [
  { label: '主题模式', value: preferences.value.theme.mode },
  { label: '解析模式', value: resolvedMode.value },
  { label: '主题色', value: preferences.value.theme.colorPrimary },
  { label: '布局模式', value: preferences.value.app.layout },
  { label: '圆角比例', value: preferences.value.theme.radiusScale.toFixed(2) },
  { label: '侧边栏宽度', value: `${preferences.value.sidebar.width}px` },
  { label: '标签页', value: preferences.value.tabbar.enable ? 'enabled' : 'disabled' },
  { label: '页面动画', value: preferences.value.transition.enable ? preferences.value.transition.name : 'disabled' },
])

const previewStyle = computed(() => ({
  '--luma-admin-example-preview-color': preferences.value.theme.colorPrimary,
  '--luma-admin-example-preview-radius': `${Math.round(8 * preferences.value.theme.radiusScale)}px`,
}))

/***********************事件处理*********************/
function handleChange(next: LumaPreferences): void {
  preferences.value = next
}
</script>

<template>
  <main class="luma-admin-example">
    <LumaPage title="主题与动画" description="使用 LumaThemeSettingsPanel 驱动主题、动画和布局偏好。">
      <div class="luma-admin-example__theme-layout">
        <LumaThemeSettingsPanel
          v-model:preferences="preferences"
          class="luma-admin-example__theme-panel"
          @change="handleChange"
        />

        <div class="luma-admin-example__theme-detail">
          <div class="luma-admin-example__theme-preview" :style="previewStyle">
            <strong>Luma Theme Preview</strong>
            <span>主题变量会影响预览区颜色和圆角。</span>
          </div>

          <LumaInfoTable :items="preferenceItems" :columns="2" label-width="96px" />
        </div>
      </div>
    </LumaPage>
  </main>
</template>

<style scoped lang="scss">
.luma-admin-example__theme-layout {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
}

.luma-admin-example__theme-panel {
  flex: 0 0 260px;
  padding: 16px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  background: var(--el-bg-color);
}

.luma-admin-example__theme-detail {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
  min-width: 280px;
}
</style>
