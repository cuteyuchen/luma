<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { LumaLayoutMenuItem } from './types'
import { ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'
import { useTemplateRef } from 'vue'

/***********************属性定义*********************/
withDefaults(defineProps<{
  menus?: LumaLayoutMenuItem[]
  activePath?: string
}>(), {
  activePath: '',
  menus: () => [],
})

const emit = defineEmits<{
  select: [path: string]
}>()

/***********************模板引用*********************/
const menuRef = useTemplateRef<ComponentPublicInstance>('menuRef')

/***********************事件处理*********************/
function handleSelect(path: string): void {
  emit('select', path)
}

/***********************公开方法*********************/
defineExpose({
  getMenuElement: () => menuRef.value?.$el as HTMLElement | undefined,
  getMenuInstance: () => menuRef.value,
})
</script>

<template>
  <ElMenu
    ref="menuRef"
    class="luma-top-nav"
    mode="horizontal"
    :default-active="activePath"
    :ellipsis="false"
  >
    <template v-for="item in menus" :key="item.path">
      <ElSubMenu v-if="item.children?.length" :index="item.path">
        <template #title>
          <span>{{ item.title }}</span>
        </template>
        <ElMenuItem
          v-for="child in item.children"
          :key="child.path"
          :index="child.path"
          @click="handleSelect(child.path)"
        >
          {{ child.title }}
        </ElMenuItem>
      </ElSubMenu>
      <ElMenuItem
        v-else
        :index="item.path"
        @click="handleSelect(item.path)"
      >
        {{ item.title }}
      </ElMenuItem>
    </template>
  </ElMenu>
</template>

<style scoped lang="scss">
.luma-top-nav {
  min-width: 0;
  border-bottom: 0;
  background: transparent;
}
</style>
