<script setup lang="ts">
import { LumaPage } from '@luma/core/components'

/***********************页面数据*********************/
const features = [
  '菜单节点来自后端菜单格式',
  '路由记录由 @luma/core/router 生成',
  '权限不足会通过守卫进入 403 页面',
]
</script>

<template>
  <main class="luma-admin-page">
    <LumaPage
      title="项目管理"
      description="这是一个需要 project:list 权限的路由页面。"
    >
      <ul class="luma-admin-page__list">
        <li
          v-for="feature in features"
          :key="feature"
          class="luma-admin-page__item"
        >
          {{ feature }}
        </li>
      </ul>
    </LumaPage>
  </main>
</template>
