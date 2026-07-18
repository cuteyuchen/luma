<script setup lang="ts">
import type { ComponentPublicInstance, CSSProperties } from 'vue'
import type { LumaLayoutMenuItem } from './types'
import { LumaIcon } from '@luma/icons-vue'
import { ElMenu, ElMenuItem } from 'element-plus'
import { computed, useTemplateRef } from 'vue'
import LumaMenuBadge from './LumaMenuBadge.vue'
import LumaTopNavMenuItem from './LumaTopNavMenuItem.vue'
import { includesMenuPath } from './state/menu-layout'

/***********************属性定义*********************/
const props = withDefaults(defineProps<{
  activePath?: string
  align?: 'center' | 'left' | 'right'
  maxWidth?: number | string
  menus?: LumaLayoutMenuItem[]
  mode?: 'flat' | 'tree'
}>(), {
  activePath: '',
  align: 'left',
  maxWidth: '100%',
  menus: () => [],
  mode: 'tree',
})

const emit = defineEmits<{
  select: [path: string]
}>()

const menuRef = useTemplateRef<ComponentPublicInstance>('menuRef')
const visibleMenus = computed(() => props.menus.filter(item => !item.hidden))
// 新开页外链只是“打开动作”，不进入 ElMenu 选中态追踪，避免点击后高亮与实际页面错位。
function isExternalAction(item: LumaLayoutMenuItem): boolean {
  return Boolean(item.externalLink) && item.externalTarget !== '_self'
}

function isMenuActive(item: LumaLayoutMenuItem): boolean {
  if (!props.activePath) {
    return false
  }

  // flat：顶级项路径直接比对；tree：叶节点或整棵子树命中都算激活。
  return props.mode === 'flat'
    ? item.path === props.activePath
    : includesMenuPath(item, props.activePath)
}

function resolveFlatMenuAttrs(item: LumaLayoutMenuItem): Record<string, unknown> {
  const active = isMenuActive(item)
  return isExternalAction(item)
    ? {
        class: [
          'el-menu-item',
          'luma-top-nav__external-item',
          { 'is-active': active },
        ],
        role: 'menuitem',
        tabindex: -1,
      }
    : {
        class: { 'is-active': active },
        index: item.path,
      }
}
const menuStyle = computed<CSSProperties>(() => ({
  '--luma-top-nav-max-width': typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth,
}))

function handleSelect(path: string): void {
  emit('select', path)
}

defineExpose({
  getMenuElement: () => menuRef.value?.$el as HTMLElement | undefined,
  getMenuInstance: () => menuRef.value,
})
</script>

<template>
  <ElMenu
    :key="`top-nav:${mode}:${activePath}`"
    ref="menuRef"
    class="luma-top-nav"
    :class="`is-align-${align}`"
    mode="horizontal"
    :default-active="activePath"
    :ellipsis="true"
    :style="menuStyle"
  >
    <LumaTopNavMenuItem
      v-for="item in mode === 'tree' ? visibleMenus : []"
      :key="`tree:${item.path}`"
      :item="item"
      :active-path="activePath"
      @select="handleSelect"
    />
    <component
      :is="isExternalAction(item) ? 'li' : ElMenuItem"
      v-for="item in mode === 'flat' ? visibleMenus : []"
      :key="`flat:${item.path}`"
      v-bind="resolveFlatMenuAttrs(item)"
      @click="handleSelect(item.path)"
    >
      <LumaIcon v-if="item.icon" :name="item.icon" :size="16" />
      <span class="luma-top-nav__label">
        <span>{{ item.title }}</span>
        <LumaMenuBadge :badge="item.badge" :label="item.title" :tone="item.badgeTone" :type="item.badgeType" />
      </span>
      <span v-if="item.externalLink" class="luma-top-nav__external" aria-hidden="true">↗</span>
    </component>
  </ElMenu>
</template>

<style scoped lang="scss">
.luma-top-nav {
  --luma-top-nav-item-height: 36px;
  --luma-top-nav-item-radius: 6px;
  --luma-top-nav-item-gap: 2px;
  --luma-top-nav-item-padding-x: 12px;

  display: flex;
  flex: 1 1 auto;
  align-items: center;
  width: 100%;
  max-width: var(--luma-top-nav-max-width);
  min-width: 0;
  height: 100%;
  border-bottom: 0 !important;
  background: transparent !important;
}

.luma-top-nav.is-align-left {
  justify-content: flex-start;
  margin-right: auto;
}

.luma-top-nav.is-align-center {
  justify-content: center;
  margin-right: auto;
  margin-left: auto;
}

.luma-top-nav.is-align-right {
  justify-content: flex-end;
  margin-left: auto;
}

.luma-top-nav :deep(.el-menu-item),
.luma-top-nav :deep(.el-sub-menu__title) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: var(--luma-top-nav-item-height) !important;
  min-height: var(--luma-top-nav-item-height) !important;
  margin: 0 var(--luma-top-nav-item-gap);
  padding: 0 var(--luma-top-nav-item-padding-x) !important;
  border-bottom: 0 !important;
  border-radius: var(--luma-top-nav-item-radius);
  color: var(--el-text-color-regular);
  font-size: calc(var(--luma-font-size-base, 14px) - 1px);
  font-weight: 500;
  line-height: 1;
  transition:
    color 0.15s ease,
    background-color 0.15s ease;
}

.luma-top-nav :deep(.el-sub-menu) {
  height: var(--luma-top-nav-item-height);
  margin: 0;
}

.luma-top-nav :deep(.el-sub-menu .el-sub-menu__icon-arrow) {
  margin-left: 4px;
  margin-top: 1px;
  font-size: 10px;
}

.luma-top-nav :deep(.el-menu-item:not(.is-disabled):hover),
.luma-top-nav :deep(.el-menu-item:not(.is-disabled):focus),
.luma-top-nav :deep(.el-sub-menu__title:hover) {
  color: var(--el-text-color-primary) !important;
  background-color: var(--el-fill-color-light) !important;
}

.luma-top-nav :deep(.el-menu-item.is-active),
.luma-top-nav :deep(.el-sub-menu.is-active > .el-sub-menu__title),
.luma-top-nav :deep(.el-sub-menu.is-active > .el-tooltip__trigger > .el-sub-menu__title) {
  color: var(--el-color-primary) !important;
  background-color: color-mix(in srgb, var(--el-color-primary) 12%, transparent) !important;
  border-bottom: 0 !important;
  font-weight: 600;
}

.luma-top-nav :deep(.el-menu--horizontal > .el-menu-item.is-active),
.luma-top-nav :deep(.el-menu--horizontal > .el-sub-menu.is-active .el-sub-menu__title) {
  border-bottom: 0 !important;
}

.luma-top-nav :deep(.el-menu--popup .el-menu-item),
.luma-top-nav :deep(.el-menu--popup .el-sub-menu__title) {
  height: 36px !important;
  min-height: 36px !important;
  margin: 2px 6px;
  border-radius: var(--luma-top-nav-item-radius);
  justify-content: flex-start;
}

.luma-top-nav__external {
  color: var(--el-text-color-placeholder);
  font-size: calc(var(--luma-font-size-base, 14px) - 2px);
}

.luma-top-nav__label {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 4px;
}
</style>
