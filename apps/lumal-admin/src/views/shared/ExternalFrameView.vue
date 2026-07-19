<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const source = computed(() => typeof route.meta.externalLink === 'string' ? route.meta.externalLink : '')
const title = computed(() => typeof route.meta.title === 'string' ? route.meta.title : '内嵌页面')
</script>

<template>
  <iframe
    v-if="source"
    class="lumal-admin-external-frame"
    :src="source"
    :title="title"
  />
</template>

<style scoped>
.lumal-admin-external-frame {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
