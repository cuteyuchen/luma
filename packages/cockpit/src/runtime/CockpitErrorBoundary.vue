<script setup lang="ts">
import { LumaIcon } from '@luma/icons-vue'
import { ElButton } from 'element-plus'
import { nextTick, onErrorCaptured, ref } from 'vue'

/***********************渲染错误边界*********************/
// 捕获子树（含异步组件加载）的渲染异常，隔离在当前容器内并提供重试。

const emit = defineEmits<{
  error: [error: unknown]
}>()

const failed = ref(false)
const capturedError = ref<unknown>(null)
// 重试通过改变 key 强制重建子树
const renderKey = ref(0)

onErrorCaptured((error) => {
  failed.value = true
  capturedError.value = error
  emit('error', error)
  // 阻止继续向上冒泡，实现隔离
  return false
})

async function retry(): Promise<void> {
  failed.value = false
  capturedError.value = null
  await nextTick()
  renderKey.value += 1
}
</script>

<template>
  <div class="luma-cockpit-error-boundary">
    <template v-if="failed">
      <slot name="error" :error="capturedError" :retry="retry">
        <div class="luma-cockpit-error-boundary__fallback" role="alert">
          <p class="luma-cockpit-error-boundary__message">
            组件渲染失败
          </p>
          <ElButton
            class="luma-cockpit-error-boundary__retry"
            @click="retry"
          >
            <LumaIcon name="luma:refresh" :size="15" />
            重试
          </ElButton>
        </div>
      </slot>
    </template>
    <template v-else>
      <slot :key="renderKey" />
    </template>
  </div>
</template>
