<script setup lang="ts">
import type { CockpitRegistry, CockpitWidgetDefinition } from '../registry/types'
import type { CockpitConfig, CockpitConfigIssue, CockpitDesignerSavePayload, CockpitThemeMode } from '../types'
import { LumaIcon } from '@luma/icons'
import { ElAlert, ElButton, ElInput, ElMessageBox, ElOption, ElSelect, ElTooltip } from 'element-plus'
import { computed, ref } from 'vue'
import CockpitComponentLibrary from './CockpitComponentLibrary.vue'
import CockpitLayoutEditor from './CockpitLayoutEditor.vue'
import { useCockpitDraft } from './useCockpitDraft'

/***********************驾驶舱装配 Designer*********************/

const props = defineProps<{
  config: CockpitConfig
  registry: CockpitRegistry
  saving?: boolean
  saveError?: string
  themeMode?: CockpitThemeMode
}>()

const emit = defineEmits<{
  save: [payload: CockpitDesignerSavePayload]
  cancel: []
}>()

const draft = useCockpitDraft(props.config)
const issues = ref<CockpitConfigIssue[]>([])
const selectedWidget = ref<CockpitWidgetDefinition>()
const activeLayout = computed(() => draft.activeLayout.value)
const errors = computed(() => issues.value.filter(issue => issue.level === 'error'))

function save(): void {
  const result = draft.buildSaveConfig()
  issues.value = result.validation.issues
  if (!result.validation.valid)
    return
  const layoutId = activeLayout.value?.id ?? result.config.activeLayoutId
  const layout = result.config.layouts.find(item => item.id === layoutId)
  if (layout)
    emit('save', { config: result.config, layout })
}

async function removeLayout(): Promise<void> {
  const layout = activeLayout.value
  if (!layout)
    return
  if (draft.layouts.value.length <= 1) {
    await ElMessageBox.alert('至少保留一个布局。', '无法删除', { confirmButtonText: '知道了', type: 'warning' })
    return
  }
  try {
    await ElMessageBox.confirm(`确定删除布局“${layout.title}”吗？`, '删除布局', {
      cancelButtonText: '取消',
      confirmButtonText: '删除',
      type: 'warning',
    })
    draft.removeLayout(layout.id)
  }
  catch {
    // 用户取消时保留草稿，不需要额外提示。
  }
}

async function reset(): Promise<void> {
  try {
    await ElMessageBox.confirm('将放弃本次尚未保存的所有布局调整，是否继续？', '重置草稿', {
      cancelButtonText: '取消',
      confirmButtonText: '重置',
      type: 'warning',
    })
    draft.reset()
    issues.value = []
  }
  catch {
    // 用户取消时保留当前草稿。
  }
}
</script>

<template>
  <div class="luma-cockpit-designer" :data-cockpit-theme="themeMode ?? 'dark'">
    <header class="luma-cockpit-designer__toolbar">
      <h2 class="luma-cockpit-designer__heading">
        <LumaIcon name="luma:settings" :size="18" />
        驾驶舱布局
      </h2>
      <div class="luma-cockpit-designer__layout-controls">
        <label class="luma-cockpit-designer__field">
          <span>布局</span>
          <ElSelect :model-value="activeLayout?.id" aria-label="选择布局" @update:model-value="draft.selectLayout">
            <ElOption v-for="layout in draft.layouts.value" :key="layout.id" :label="layout.title" :value="layout.id" />
          </ElSelect>
        </label>
        <ElInput
          v-if="activeLayout"
          :model-value="activeLayout.title"
          aria-label="当前布局名称"
          @change="draft.renameLayout(activeLayout.id, $event)"
        />
        <ElButton type="primary" @click="draft.addLayout()">
          <LumaIcon name="luma:plus" :size="15" />
          添加布局
        </ElButton>
        <ElButton v-if="activeLayout" @click="draft.duplicateLayout(activeLayout.id)">复制布局</ElButton>
        <ElButton v-if="activeLayout" type="danger" plain @click="removeLayout">删除布局</ElButton>
      </div>
      <div class="luma-cockpit-designer__toolbar-actions">
        <ElTooltip content="重置未保存的草稿" placement="bottom">
          <ElButton circle aria-label="重置未保存的草稿" @click="reset">
            <LumaIcon name="luma:reset" :size="16" />
          </ElButton>
        </ElTooltip>
        <ElButton @click="emit('cancel')">取消</ElButton>
        <ElButton type="primary" class="luma-cockpit-designer__save" :loading="saving" :aria-busy="saving" @click="save">
          {{ saving ? '保存中…' : '保存' }}
        </ElButton>
      </div>
    </header>

    <div v-if="errors.length || saveError" class="luma-cockpit-designer__issues" role="alert">
      <ElAlert v-if="saveError" type="error" :closable="false" :title="`保存失败：${saveError}`" show-icon />
      <ElAlert v-for="(issue, index) in errors" :key="index" type="error" :closable="false" :title="issue.message" show-icon />
    </div>

    <main class="luma-cockpit-designer__workspace">
      <CockpitLayoutEditor :draft="draft" :selected-widget="selectedWidget" side="left" />
      <CockpitLayoutEditor :draft="draft" :selected-widget="selectedWidget" side="right" />
      <CockpitComponentLibrary :registry="registry" :selected-type="selectedWidget?.type" @select-widget="selectedWidget = $event" />
    </main>
  </div>
</template>
