<script setup lang="ts">
import type { SchemaTableColumn, SchemaTableRow } from '@luma/core/components'
import { LumaPage, LumaSchemaTable } from '@luma/core/components'
import { ElButton } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

const capabilityRows: SchemaTableRow[] = [
  { entry: '@luma/core/layout', id: 1, route: '/examples/page-layout', status: 'stable', title: '应用壳与页面布局' },
  { entry: '@luma/core/components', id: 2, route: '/examples/schema-form', status: 'stable', title: 'Schema Form' },
  { entry: '@luma/core/components', id: 3, route: '/examples/schema-table', status: 'stable', title: 'Schema Table' },
  { entry: '@luma/core/components', id: 4, route: '/examples/crud-table', status: 'stable', title: 'CRUD 工作流' },
  { entry: '@luma/core/dictionary', id: 5, route: '/examples/dictionary', status: 'stable', title: '字典与颜色标签' },
  { entry: '@luma/core/request', id: 6, route: '/examples/services', status: 'stable', title: '请求、适配与会话刷新' },
  { entry: '@luma/charts', id: 7, route: '/examples/chart-panel', status: 'enhancing', title: '图表面板' },
]

const columns: SchemaTableColumn[] = [
  { field: 'title', label: '能力', minWidth: 190 },
  { field: 'entry', label: '公开入口', minWidth: 220 },
  {
    field: 'status',
    label: '状态',
    options: [
      { label: '稳定', value: 'stable' },
      { label: '持续增强', value: 'enhancing' },
    ],
    width: 110,
  },
]

function openCapability(row: SchemaTableRow): void {
  void router.push(String(row.route))
}
</script>

<template>
  <main class="luma-admin-example">
    <LumaPage
      title="公开能力索引"
      description="按公开包入口查看当前可复用能力；示例只演示公共 API，不承载公司字段或页面私有实现。"
    >
      <LumaSchemaTable :columns="columns" :rows="capabilityRows" row-key="id" action-width="120">
        <template #actions="{ row }">
          <ElButton link type="primary" native-type="button" @click="openCapability(row)">
            查看示例
          </ElButton>
        </template>
      </LumaSchemaTable>
    </LumaPage>
  </main>
</template>
