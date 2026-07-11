<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import LumaIconPicker from './LumaIconPicker.vue'

withDefaults(defineProps<{
  cancelText?: string
  confirmText?: string
  title?: string
}>(), {
  cancelText: '取消',
  confirmText: '确认选择',
  title: '选择图标',
})

const emit = defineEmits<{
  cancel: []
  confirm: [icon: string]
}>()

const visible = defineModel<boolean>('visible', { default: false })
const iconValue = defineModel<string>()
const draftValue = ref('')
const dialogRef = ref<HTMLElement>()

watch(visible, async (nextVisible) => {
  if (!nextVisible) {
    return
  }

  draftValue.value = iconValue.value ?? ''
  await nextTick()
  dialogRef.value?.focus()
}, { immediate: true })

function cancel(): void {
  visible.value = false
  emit('cancel')
}

function confirm(): void {
  if (!draftValue.value) {
    return
  }

  iconValue.value = draftValue.value
  visible.value = false
  emit('confirm', draftValue.value)
}
</script>

<template>
  <div v-if="visible" class="luma-icon-picker-dialog" role="presentation" @mousedown.self="cancel">
    <section
      ref="dialogRef"
      class="luma-icon-picker-dialog__body"
      role="dialog"
      aria-modal="true"
      :aria-label="title"
      tabindex="-1"
      @keydown.esc="cancel"
    >
      <header class="luma-icon-picker-dialog__header">
        <h3>{{ title }}</h3>
        <button type="button" aria-label="关闭图标选择器" @click="cancel">
          ×
        </button>
      </header>

      <div class="luma-icon-picker-dialog__content">
        <LumaIconPicker v-model="draftValue" />
      </div>

      <footer class="luma-icon-picker-dialog__footer">
        <button type="button" @click="cancel">
          {{ cancelText }}
        </button>
        <button type="button" class="is-primary" :disabled="!draftValue" @click="confirm">
          {{ confirmText }}
        </button>
      </footer>
    </section>
  </div>
</template>

<style scoped lang="scss">
.luma-icon-picker-dialog {
  position: fixed;
  z-index: var(--luma-z-dialog, 500);
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: color-mix(in srgb, CanvasText 48%, transparent);
}

.luma-icon-picker-dialog__body {
  display: grid;
  width: min(680px, 100%);
  max-height: min(680px, 88dvh);
  overflow: hidden;
  border-radius: var(--luma-radius-large, 12px);
  color: var(--el-text-color-primary, CanvasText);
  background: var(--el-bg-color, Canvas);
  box-shadow: var(--luma-shadow-dialog, 0 18px 48px color-mix(in srgb, CanvasText 18%, transparent));
}

.luma-icon-picker-dialog__header,
.luma-icon-picker-dialog__footer {
  display: flex;
  min-height: 56px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 20px;
}

.luma-icon-picker-dialog__header {
  border-bottom: 1px solid var(--el-border-color-lighter, currentColor);
}

.luma-icon-picker-dialog__header h3 {
  margin: 0;
  font-size: 17px;
}

.luma-icon-picker-dialog__content {
  min-height: 0;
  overflow: auto;
  padding: 20px;
}

.luma-icon-picker-dialog__footer {
  justify-content: flex-end;
  border-top: 1px solid var(--el-border-color-lighter, currentColor);
}

.luma-icon-picker-dialog button {
  min-width: 44px;
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid var(--el-border-color, currentColor);
  border-radius: var(--luma-radius-base, 8px);
  color: inherit;
  background: var(--el-bg-color, Canvas);
  cursor: pointer;
}

.luma-icon-picker-dialog button.is-primary {
  border-color: var(--el-color-primary, Highlight);
  color: var(--el-color-white, HighlightText);
  background: var(--el-color-primary, Highlight);
}

.luma-icon-picker-dialog button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

@media (max-width: 640px) {
  .luma-icon-picker-dialog {
    align-items: flex-end;
    padding: 0;
  }

  .luma-icon-picker-dialog__body {
    max-height: 92dvh;
    border-radius: var(--luma-radius-large, 12px) var(--luma-radius-large, 12px) 0 0;
  }
}
</style>
