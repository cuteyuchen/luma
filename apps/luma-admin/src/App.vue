<script setup lang="ts">
import { LumaLayout, LumaRouterView } from '@luma/core/layout'
import { computed, shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  createAdminSidebarMenus,
  createAdminTabs,
} from './router'

/***********************页面状态*********************/
const title = 'Luma Admin'
const collapsed = shallowRef(false)

/***********************路由状态*********************/
const route = useRoute()
const router = useRouter()

const menus = computed(() => createAdminSidebarMenus())
const tabs = computed(() => createAdminTabs(route.path))
const activePath = computed({
  get: () => route.path,
  set: (path: string) => {
    if (path !== route.path) {
      void router.push(path)
    }
  },
})

/***********************导航事件*********************/
function handleMenuSelect(path: string): void {
  activePath.value = path
}

function handleTabChange(path: string): void {
  activePath.value = path
}
</script>

<template>
  <LumaLayout
    v-model:collapsed="collapsed"
    v-model:active-tab-path="activePath"
    :title="title"
    :menus="menus"
    :tabs="tabs"
    :active-menu-path="activePath"
    @menu-select="handleMenuSelect"
    @tab-change="handleTabChange"
  >
    <template #headerActions>
      <span class="luma-admin-home__status">Mini</span>
    </template>

    <LumaRouterView />
  </LumaLayout>
</template>
