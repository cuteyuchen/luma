<script setup lang="ts">
import { LumaIcon } from '@luma/core/components'

/***********************页面状态*********************/
const title = 'Luma Admin'
const description = '轻量 Vue Admin 框架基线已启动'
</script>

<template>
  <main class="luma-admin-home">
    <section class="luma-admin-home__panel">
      <LumaIcon name="app:dashboard" color="#1677ff" :size="36" />
      <div class="luma-admin-home__content">
        <h1 class="luma-admin-home__title">
          {{ title }}
        </h1>
        <p class="luma-admin-home__description">
          {{ description }}
        </p>
      </div>
    </section>
  </main>
</template>
