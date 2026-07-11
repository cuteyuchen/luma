<script setup lang="ts">
import { LumaPage } from '@luma/core/components'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const source = computed(() => typeof route.meta.externalLink === 'string' ? route.meta.externalLink : '')
const title = computed(() => typeof route.meta.title === 'string' ? route.meta.title : '内嵌页面')
</script>

<template>
  <main class="luma-admin-page luma-admin-external-frame-page">
    <LumaPage :title="title" description="页面内容由外部地址提供。">
      <iframe
        v-if="source"
        class="luma-admin-external-frame"
        :src="source"
        :title="title"
      />
    </LumaPage>
  </main>
</template>

<style scoped>
.luma-admin-external-frame-page :deep(.luma-page__content) {
  min-height: 0;
}

.luma-admin-external-frame {
  display: block;
  width: 100%;
  min-height: 560px;
  border: 1px solid var(--luma-color-border);
  border-radius: var(--luma-radius-base);
  background: var(--luma-color-bg-surface);
}

@media (max-width: 768px) {
  .luma-admin-external-frame {
    min-height: 65dvh;
  }
}
</style>
