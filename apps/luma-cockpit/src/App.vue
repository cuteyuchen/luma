<script setup lang="ts">
import type { ThemeMode } from '@luma/core/theme'
import type { CockpitConfig, CockpitDesignerSavePayload } from '@luma/cockpit'
import { LumaCockpitDesigner } from '@luma/cockpit/designer'
import { LumaCockpit } from '@luma/cockpit/runtime'
import { LumaIcon } from '@luma/icons'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import { standaloneCockpitRegistry } from './registry'
import { loadStandaloneConfig, saveStandaloneConfig } from './services/config'
import {
  setStandaloneThemeMode,
  standalonePreferences,
  standaloneResolvedThemeMode,
} from './services/preferences'

/***********************独立驾驶舱根组件*********************/

const config = shallowRef<CockpitConfig>(loadStandaloneConfig())
const designerVisible = ref(false)
const saving = ref(false)
const saveError = ref<string>('')

const activeCategoryId = ref<string | undefined>()
const activePageId = ref<string | undefined>()
const fullscreenActive = ref(false)
const cockpitRef = ref<InstanceType<typeof LumaCockpit> | null>(null)

const themeModeIcon = computed(() => {
  const mode = standalonePreferences.value.theme.mode
  if (mode === 'light')
    return 'luma:sun'
  if (mode === 'dark')
    return 'luma:moon'
  return 'luma:monitor'
})

const themeModeLabel = computed(() => {
  const mode = standalonePreferences.value.theme.mode
  if (mode === 'light')
    return '浅色'
  if (mode === 'dark')
    return '深色'
  return '跟随系统'
})

function cycleThemeMode(): void {
  const order: ThemeMode[] = ['system', 'light', 'dark']
  const current = standalonePreferences.value.theme.mode
  const next = order[(order.indexOf(current) + 1) % order.length] ?? 'system'
  setStandaloneThemeMode(next)
}

function openDesigner(): void {
  designerVisible.value = true
}

function closeDesigner(): void {
  designerVisible.value = false
  saveError.value = ''
}

function syncFullscreenState(): void {
  fullscreenActive.value = Boolean(document.fullscreenElement)
}

async function toggleFullscreen(): Promise<void> {
  if (document.fullscreenElement) {
    await cockpitRef.value?.exitFullscreen()
  }
  else {
    await cockpitRef.value?.enterFullscreen()
  }
  syncFullscreenState()
}

function handleSave(payload: CockpitDesignerSavePayload): void {
  saving.value = true
  saveError.value = ''
  try {
    config.value = saveStandaloneConfig(payload.config)
    designerVisible.value = false
  }
  catch (error) {
    saveError.value = error instanceof Error ? error.message : '保存失败'
  }
  finally {
    saving.value = false
  }
}

onMounted(() => {
  document.addEventListener('fullscreenchange', syncFullscreenState)
  syncFullscreenState()
})

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', syncFullscreenState)
})
</script>

<template>
  <div class="standalone-app">
    <LumaCockpit
      ref="cockpitRef"
      v-model:active-category-id="activeCategoryId"
      v-model:active-page-id="activePageId"
      :config="config"
      :registry="standaloneCockpitRegistry"
      :theme-mode="standaloneResolvedThemeMode"
      @configure="openDesigner"
    >
      <template #header-actions>
        <div class="standalone-app__actions">
          <button
            type="button"
            data-action="cockpit-theme"
            :aria-label="`切换主题，当前：${themeModeLabel}`"
            :title="`切换主题，当前：${themeModeLabel}`"
            @click="cycleThemeMode"
          >
            <LumaIcon :name="themeModeIcon" :size="18" />
          </button>
          <button
            type="button"
            data-action="cockpit-fullscreen"
            :aria-label="fullscreenActive ? '退出全屏' : '进入全屏'"
            :title="fullscreenActive ? '退出全屏' : '进入全屏'"
            @click="toggleFullscreen"
          >
            <LumaIcon :name="fullscreenActive ? 'luma:fullscreen-exit' : 'luma:fullscreen'" :size="18" />
          </button>
          <button
            type="button"
            data-action="cockpit-configure"
            aria-label="打开配置器"
            title="打开配置器"
            @click="openDesigner"
          >
            <LumaIcon name="luma:settings" :size="18" />
          </button>
        </div>
      </template>
    </LumaCockpit>

    <div
      v-if="designerVisible"
      class="standalone-app__designer"
      role="dialog"
      aria-label="驾驶舱配置"
    >
      <LumaCockpitDesigner
        :config="config"
        :registry="standaloneCockpitRegistry"
        :saving="saving"
        :save-error="saveError"
        :theme-mode="standaloneResolvedThemeMode"
        @save="handleSave"
        @cancel="closeDesigner"
      />
    </div>
  </div>
</template>

<style scoped>
.standalone-app {
  position: fixed;
  inset: 0;
}

.standalone-app__designer {
  position: fixed;
  inset: 0;
  z-index: 2050;
}

.standalone-app__actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.standalone-app__actions button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  min-width: 44px;
  border: 1px solid var(--luma-cockpit-border);
  border-radius: var(--luma-cockpit-radius);
  background: var(--luma-cockpit-floating-bg);
  color: inherit;
  cursor: pointer;
}

.standalone-app__actions button:focus-visible {
  outline: 2px solid var(--luma-cockpit-focus-ring);
  outline-offset: 2px;
}
</style>
