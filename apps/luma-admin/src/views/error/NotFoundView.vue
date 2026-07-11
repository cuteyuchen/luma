<script setup lang="ts">
import { LumaPage } from '@luma/core/components'
import { ElButton } from 'element-plus'
import { useRouter } from 'vue-router'
import { resolveFirstAccessibleAdminPath } from '../../router'

const router = useRouter()

function handleBackClick(): void {
  void router.push(resolveFirstAccessibleAdminPath(router))
}
</script>

<template>
  <main class="luma-admin-page">
    <LumaPage
      title="页面不存在"
      description="当前地址不存在或已被移除，请返回可访问的后台页面。"
    >
      <ElButton type="primary" @click="handleBackClick">
        返回后台
      </ElButton>
    </LumaPage>
  </main>
</template>
