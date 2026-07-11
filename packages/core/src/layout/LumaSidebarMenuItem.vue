<script setup lang="ts">
import type { LumaLayoutMenuItem } from './types'
import { LumaIcon } from '@luma/icons'
import { ElMenuItem, ElSubMenu } from 'element-plus'
import { computed } from 'vue'

/***********************属性定义*********************/
const props = defineProps<{
  activePath?: string
  collapsed?: boolean
  depth?: number
  item: LumaLayoutMenuItem
}>()

const emit = defineEmits<{
  select: [path: string]
}>()

/***********************菜单状态*********************/
const visibleChildren = computed(() => props.item.children?.filter(child => !child.hidden) ?? [])
const hasChildren = computed(() => visibleChildren.value.length > 0)

/***********************事件处理*********************/
function handleSelect(path: string): void {
  emit('select', path)
}
</script>

<template>
  <ElSubMenu
    v-if="hasChildren"
    class="luma-sidebar-menu-item"
    :index="item.path"
    :title="collapsed ? item.title : undefined"
  >
    <template #title>
      <i
        v-if="item.icon"
        class="luma-sidebar-menu-item__icon"
        aria-hidden="true"
      >
        <LumaIcon :name="item.icon" :size="16" />
      </i>
      <span class="luma-sidebar-menu-item__title">{{ item.title }}</span>
      <span v-if="item.externalLink" class="luma-sidebar-menu-item__external" aria-hidden="true">↗</span>
    </template>

    <LumaSidebarMenuItem
      v-for="child in visibleChildren"
      :key="child.path"
      :item="child"
      :active-path="activePath"
      :collapsed="collapsed"
      :depth="(depth ?? 0) + 1"
      @select="handleSelect"
    />
  </ElSubMenu>

  <ElMenuItem
    v-else
    class="luma-sidebar-menu-item"
    :index="item.path"
    :title="collapsed ? item.title : undefined"
    @click="handleSelect(item.path)"
  >
    <i
      v-if="item.icon"
      class="luma-sidebar-menu-item__icon"
      aria-hidden="true"
    >
      <LumaIcon :name="item.icon" :size="16" />
    </i>
    <span class="luma-sidebar-menu-item__title">{{ item.title }}</span>
    <span v-if="item.externalLink" class="luma-sidebar-menu-item__external" aria-hidden="true">↗</span>
  </ElMenuItem>
</template>

<style scoped lang="scss">
.luma-sidebar-menu-item__icon {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  font-style: normal;
}

.luma-sidebar-menu-item__title {
  overflow: hidden;
  text-overflow: ellipsis;
}

.luma-sidebar-menu-item__external {
  margin-left: auto;
  color: var(--el-text-color-placeholder);
  font-size: 12px;
}
</style>
