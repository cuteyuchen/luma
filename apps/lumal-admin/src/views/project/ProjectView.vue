<script setup lang="ts">
import { LumalPage } from '@lumal/core/components'

/***********************页面数据*********************/
const features = [
  '菜单节点来自后端菜单格式',
  '路由记录由 @lumal/core/router 生成',
  '权限不足会通过守卫进入 403 页面',
]
</script>

<template>
  <main class="lumal-admin-page">
    <LumalPage
      title="项目管理"
      description="这是一个需要 project:list 权限的路由页面。"
    >
      <ul class="lumal-admin-page__list">
        <li
          v-for="feature in features"
          :key="feature"
          class="lumal-admin-page__item"
        >
          {{ feature }}
        </li>
      </ul>
    </LumalPage>
  </main>
</template>
