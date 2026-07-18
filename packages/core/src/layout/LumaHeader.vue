<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { ElButton, ElHeader } from 'element-plus'
import { computed, useTemplateRef } from 'vue'

/***********************属性定义*********************/
const props = withDefaults(defineProps<{
  title?: string
  collapsed?: boolean
  height?: string
  mobileOnlyToggle?: boolean
  sidebarEnabled?: boolean
  toggleAfterTitle?: boolean
}>(), {
  collapsed: false,
  height: '50px',
  mobileOnlyToggle: false,
  sidebarEnabled: true,
  toggleAfterTitle: false,
})

const emit = defineEmits<{
  toggleCollapse: []
}>()

/***********************模板引用*********************/
const headerRef = useTemplateRef<ComponentPublicInstance>('headerRef')

/***********************显示状态*********************/
const toggleLabel = computed(() => props.collapsed ? '展开侧边栏' : '收起侧边栏')

/***********************事件处理*********************/
function handleToggleClick(): void {
  emit('toggleCollapse')
}

/***********************公开方法*********************/
defineExpose({
  getHeaderElement: () => headerRef.value?.$el as HTMLElement | undefined,
  getHeaderInstance: () => headerRef.value,
})
</script>

<template>
  <ElHeader ref="headerRef" class="luma-header" :height="height">
    <div class="luma-header__left">
      <slot name="logo">
        <span v-if="title" class="luma-header__title">{{ title }}</span>
      </slot>

      <ElButton
        v-if="sidebarEnabled"
        class="luma-header__toggle"
        :class="{
          'is-after-title': toggleAfterTitle,
          'is-mobile-only': mobileOnlyToggle,
        }"
        text
        :aria-label="toggleLabel"
        data-action="toggle-sidebar"
        @click="handleToggleClick"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </ElButton>
    </div>

    <div v-if="$slots.breadcrumb" class="luma-header__breadcrumb">
      <slot name="breadcrumb" />
    </div>

    <nav v-if="$slots.navigation" class="luma-header__navigation" aria-label="主导航">
      <slot name="navigation" />
    </nav>

    <div v-if="$slots.actions" class="luma-header__actions">
      <slot name="actions" />
    </div>
  </ElHeader>
</template>

<style scoped lang="scss">
.luma-header {
  position: relative;
  z-index: var(--luma-z-header);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
  flex: 0 0 auto;
  padding: 0 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);
}

.luma-header__left {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 8px;
}

.luma-header__toggle {
  order: -1;
  flex: none;
  width: 32px;
  height: 32px;
  margin-left: -4px;
  padding: 0;
  border-radius: 6px;
  color: var(--el-text-color-regular);
}

.luma-header__toggle:hover {
  color: var(--el-text-color-primary);
  background: var(--el-fill-color-light);
}

.luma-header__toggle.is-after-title {
  order: initial;
  margin-right: -4px;
  margin-left: 0;
}

.luma-header__toggle.is-mobile-only {
  display: none;
}

.luma-header__toggle svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentcolor;
  stroke-linecap: round;
  stroke-width: 1.8;
}

.luma-header__title {
  min-width: 0;
  overflow: hidden;
  color: var(--el-text-color-primary);
  font-size: var(--luma-font-size-base, 14px);
  font-weight: 600;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.luma-header__navigation {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  align-self: stretch;
  min-width: 0;
  margin-left: 12px;
  overflow: hidden;
}

.luma-header__breadcrumb {
  display: flex;
  flex: 1 1 auto;
  min-width: 0;
  align-items: center;
  margin-left: 12px;
  overflow: hidden;
}

.luma-header__actions {
  display: flex;
  flex: none;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
}

@media (max-width: 1024px) {
  .luma-header {
    padding: 0 10px;
  }

  .luma-header__navigation,
  .luma-header__breadcrumb {
    margin-left: 8px;
  }
}

@media (max-width: 768px) {
  .luma-header {
    padding: 0 10px;
  }

  .luma-header__navigation,
  .luma-header__breadcrumb {
    display: none;
  }

  .luma-header__toggle.is-mobile-only {
    display: inline-flex;
  }

  .luma-header__left {
    flex: 1 1 auto;
  }
}
</style>
