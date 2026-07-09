<script setup lang="ts">
import type {
  PaginationChangePayload,
  SchemaFormItem,
  SchemaFormModel,
  SchemaTableColumn,
  SchemaTableRow,
} from '@luma/core/components'
import { LumaPage } from '@luma/core/components'
import { computed, shallowRef } from 'vue'
import PlaygroundFormPanel from './components/playground/PlaygroundFormPanel.vue'
import PlaygroundIconPanel from './components/playground/PlaygroundIconPanel.vue'
import PlaygroundTablePanel from './components/playground/PlaygroundTablePanel.vue'

/***********************页面状态*********************/
const selectedIcon = shallowRef('playground:form')
const page = shallowRef(1)
const pageSize = shallowRef(10)
const formMessage = shallowRef('等待提交表单')
const paginationMessage = shallowRef('等待分页操作')

/***********************表单配置*********************/
const formModel = shallowRef<SchemaFormModel>({
  name: 'Luma Playground',
  type: 'admin',
  remark: '通过公开包入口验证组件工作台',
})

const formSchemas: SchemaFormItem[] = [
  {
    field: 'name',
    label: '名称',
    component: 'input',
    required: true,
    placeholder: '请输入名称',
  },
  {
    field: 'type',
    label: '类型',
    component: 'select',
    options: [
      { label: '后台框架', value: 'admin' },
      { label: '组件验证', value: 'component' },
      { label: '迁移适配', value: 'compat' },
    ],
    placeholder: '请选择类型',
  },
  {
    field: 'remark',
    label: '备注',
    component: 'textarea',
    placeholder: '请输入备注',
  },
]

/***********************表格配置*********************/
const tableColumns: SchemaTableColumn[] = [
  {
    field: 'name',
    label: '能力',
  },
  {
    field: 'package',
    label: '包',
    width: 150,
  },
  {
    field: 'status',
    label: '状态',
    width: 120,
  },
]

const tableRows = computed<SchemaTableRow[]>(() => [
  {
    id: 'icon',
    name: `当前图标：${selectedIcon.value}`,
    package: '@luma/icons',
    status: '已注册',
  },
  {
    id: 'form',
    name: String(formModel.value.name ?? '表单模型'),
    package: '@luma/core',
    status: String(formModel.value.type ?? 'admin'),
  },
  {
    id: 'pagination',
    name: `第 ${page.value} 页 / 每页 ${pageSize.value} 条`,
    package: '@luma/core',
    status: '同步中',
  },
])

/***********************事件处理*********************/
function handleFormSubmit(model: SchemaFormModel): void {
  formMessage.value = `已提交：${String(model.name ?? '') || '未命名'}`
}

function handlePageChange(payload: PaginationChangePayload): void {
  paginationMessage.value = `当前第 ${payload.page} 页，每页 ${payload.pageSize} 条`
}
</script>

<template>
  <main class="playground">
    <header class="playground__masthead">
      <div class="playground__heading">
        <span class="playground__eyebrow">Luma</span>
        <h1 class="playground__title">
          Playground
        </h1>
      </div>
      <p class="playground__description">
        使用 workspace 包名消费 @luma/core 与 @luma/icons。
      </p>
    </header>

    <section class="playground__grid">
      <LumaPage
        title="图标"
        description="验证注册、选择和渲染链路。"
      >
        <PlaygroundIconPanel v-model="selectedIcon" />
      </LumaPage>

      <LumaPage
        title="表单"
        description="验证 Schema 表单模型回写。"
      >
        <PlaygroundFormPanel
          v-model="formModel"
          :schemas="formSchemas"
          :message="formMessage"
          @submit="handleFormSubmit"
        />
      </LumaPage>

      <LumaPage
        class="playground__wide"
        title="表格"
        description="验证 Schema 表格和分页联动。"
      >
        <PlaygroundTablePanel
          v-model:page="page"
          v-model:page-size="pageSize"
          :columns="tableColumns"
          :rows="tableRows"
          :message="paginationMessage"
          @change="handlePageChange"
        />
      </LumaPage>
    </section>
  </main>
</template>
