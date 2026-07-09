<script setup lang="ts">
import type { SchemaFormItem, SchemaFormModel, SchemaTableColumn, SchemaTableRow } from '@luma/core/components'
import { LumaIcon, LumaSchemaForm, LumaSchemaTable } from '@luma/core/components'
import { shallowRef } from 'vue'

/***********************页面状态*********************/
const title = 'Luma Admin'
const description = '轻量 Vue Admin 框架基线已启动'

/***********************表单配置*********************/
const formModel = shallowRef<SchemaFormModel>({
  id: 'demo-001',
  name: 'Luma 示例项目',
  status: 'enabled',
})

const schemas: SchemaFormItem[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'hidden',
  },
  {
    field: 'name',
    label: '项目名称',
    component: 'input',
    placeholder: '请输入项目名称',
  },
  {
    field: 'status',
    label: '状态',
    component: 'select',
    options: [
      { label: '启用', value: 'enabled' },
      { label: '停用', value: 'disabled' },
    ],
  },
]

/***********************表格配置*********************/
const tableColumns: SchemaTableColumn[] = [
  {
    field: 'name',
    label: '项目名称',
  },
  {
    field: 'status',
    label: '状态',
    formatter: value => value === 'enabled' ? '启用' : '停用',
  },
]

const tableRows: SchemaTableRow[] = [
  {
    id: 'demo-001',
    name: 'Luma 示例项目',
    status: 'enabled',
  },
]
</script>

<template>
  <main class="luma-admin-home">
    <section class="luma-admin-home__panel">
      <header class="luma-admin-home__header">
        <LumaIcon name="app:dashboard" color="#1677ff" :size="36" />
        <div class="luma-admin-home__content">
          <h1 class="luma-admin-home__title">
            {{ title }}
          </h1>
          <p class="luma-admin-home__description">
            {{ description }}
          </p>
        </div>
      </header>

      <div class="luma-admin-home__form">
        <LumaSchemaForm v-model="formModel" :schemas="schemas" />
      </div>

      <div class="luma-admin-home__table">
        <LumaSchemaTable row-key="id" :columns="tableColumns" :rows="tableRows" />
      </div>
    </section>
  </main>
</template>
