<script setup lang="ts">
import type { SchemaFormItem, SchemaFormModel } from '@luma/core/components'
import { LumaSchemaForm } from '@luma/core/components'

/***********************属性定义*********************/
defineProps<{
  schemas: SchemaFormItem[]
  message: string
}>()

const emit = defineEmits<{
  submit: [model: SchemaFormModel]
}>()

const model = defineModel<SchemaFormModel>({
  default: () => ({}),
})

/***********************事件处理*********************/
function handleSubmit(payload: SchemaFormModel): void {
  emit('submit', payload)
}
</script>

<template>
  <div class="playground-form-panel">
    <LumaSchemaForm
      v-model="model"
      :schemas="schemas"
      show-actions
      submit-text="提交"
      @submit="handleSubmit"
    />

    <p class="playground-form-panel__message">
      {{ message }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.playground-form-panel {
  display: grid;
  gap: 12px;
}

.playground-form-panel__message {
  margin: 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.5;
}
</style>
