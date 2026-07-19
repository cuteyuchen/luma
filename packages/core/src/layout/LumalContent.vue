<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { ElMain } from 'element-plus'
import { useTemplateRef } from 'vue'

/***********************模板引用*********************/
const contentRef = useTemplateRef<ComponentPublicInstance>('contentRef')

/***********************公开方法*********************/
defineExpose({
  getContentElement: () => contentRef.value?.$el as HTMLElement | undefined,
  getContentInstance: () => contentRef.value,
})
</script>

<template>
  <ElMain ref="contentRef" class="lumal-content">
    <slot />
  </ElMain>
</template>

<style scoped lang="scss">
.lumal-content {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  padding: 14px;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  background: var(--el-bg-color-page);
}

@media (max-width: 1024px) {
  .lumal-content {
    padding: 10px;
  }
}

@media (max-width: 768px) {
  .lumal-content {
    padding: 6px;
  }
}
</style>
