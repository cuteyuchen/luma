<script setup lang="ts">
import { LumaInfoTable, LumaPage } from '@luma/core/components'
import { ElButton } from 'element-plus'
import { computed } from 'vue'
import { adminPreferences, adminResolvedThemeMode } from '../../services/preferences'
import { openAdminSettings } from '../../services/settings'

const configItems = computed(() => [
  { label: '设置入口', value: '右上角“主题与布局设置”' },
  { label: '当前布局', value: adminPreferences.value.app.layout },
  { label: '当前主题', value: adminResolvedThemeMode.value },
  { label: '标签页', value: adminPreferences.value.tabbar.enable ? '已启用' : '已停用' },
  { label: '页面动画', value: adminPreferences.value.transition.enable ? '已启用' : '已停用' },
  { label: '持久化', value: '浏览器本地偏好存储' },
])
</script>

<template>
  <main class="luma-admin-page">
    <LumaPage
      title="系统配置"
      description="主题、布局、标签页和动画统一由全局设置抽屉维护，避免页面配置与应用壳状态出现双重来源。"
    >
      <template #actions>
        <ElButton type="primary" native-type="button" data-action="open-global-settings" @click="openAdminSettings">
          打开全局设置
        </ElButton>
      </template>

      <LumaInfoTable :items="configItems" :columns="3" label-width="88px" />
    </LumaPage>
  </main>
</template>
