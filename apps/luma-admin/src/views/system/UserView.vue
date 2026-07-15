<script setup lang="ts">
import type {
  CrudDataSource,
  SchemaFormItem,
  SchemaFormModel,
  SchemaTableColumn,
  SchemaTableRow,
} from '@luma/core/components'
import type { DictionaryOption } from '@luma/core/dictionary'
import type {
  SaveSystemUserInput,
  SystemOrganizationOption,
  SystemUserQuery,
  SystemUserRecord,
  SystemUserRoleAssignmentMode,
  SystemUserStatus,
} from '../../api/system'
import { LumaCrudTable, LumaSchemaForm } from '@luma/core/components'
import {
  ElAlert,
  ElButton,
  ElDialog,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElInput,
  ElMessage,
  ElMessageBox,
  ElTree,
} from 'element-plus'
import { computed, onMounted, shallowRef, useTemplateRef } from 'vue'
import { adminPermissionCodes } from '../../api/permissions'
import {
  createSystemUser,
  deleteSystemUser,
  fetchSystemOrganizationOptions,
  fetchSystemRoleOptions,
  fetchSystemUsers,
  resetSystemUserPassword,
  updateSystemUser,
  updateSystemUserRoles,
  updateSystemUsersRoles,
  updateSystemUsersStatus,
  updateSystemUserStatus,
} from '../../api/system'
import { permissionStore } from '../../services/permission'

interface UserCrudTableExpose {
  clearSelection: () => void
  openEdit: (row: SchemaTableRow) => void
  openView: (row: SchemaTableRow) => void
  reload: () => Promise<void>
  removeRow: (row: SchemaTableRow) => Promise<void>
}

interface OrganizationTreeExpose {
  filter: (keyword: string) => void
}

interface OrganizationTreeNode {
  children?: OrganizationTreeNode[]
  label: string
  value: string
}

type ClearSelection = () => void
type BatchCommand = 'assign-roles' | 'disable' | 'enable'

/***********************页面状态*********************/
const crudTableRef = useTemplateRef<UserCrudTableExpose>('crudTableRef')
const organizationTreeRef = useTemplateRef<OrganizationTreeExpose>('organizationTreeRef')
const queryModel = shallowRef<SchemaFormModel>({
  keyword: '',
  organizationId: '',
  roles: '',
  status: '',
})
const page = shallowRef(1)
const pageSize = shallowRef(10)
const roleOptions = shallowRef<DictionaryOption[]>([])
const organizationOptions = shallowRef<SystemOrganizationOption[]>([])
const organizationKeyword = shallowRef('')
const selectedOrganizationId = shallowRef('')
const roleAssignmentVisible = shallowRef(false)
const assigningUsers = shallowRef<SystemUserRecord[]>([])
const batchRoleAssignment = shallowRef(false)
const roleAssignmentModel = shallowRef<SchemaFormModel>({ roles: [] })
const roleAssignmentSaving = shallowRef(false)
const roleAssignmentError = shallowRef('')
let roleAssignmentClearSelection: ClearSelection | undefined

const organizationTree = computed<OrganizationTreeNode[]>(() => [{
  children: organizationOptions.value.map(toOrganizationTreeNode),
  label: '全部机构',
  value: '',
}])
const organizationLabelMap = computed(() => {
  const labels = new Map<string, string>()
  collectOrganizationLabels(organizationOptions.value, labels)
  return labels
})
const roleAssignmentTitle = computed(() => batchRoleAssignment.value
  ? `批量分配角色（已选 ${assigningUsers.value.length} 人）`
  : `分配角色：${assigningUsers.value[0]?.nickname ?? ''}`)
const canBatchStatus = computed(() => permissionStore.hasPermission(adminPermissionCodes.systemUserStatus))
const canBatchAssignRoles = computed(() => permissionStore.hasPermission(adminPermissionCodes.systemUserAssignRoles))
const canUseBatchActions = computed(() => canBatchStatus.value || canBatchAssignRoles.value)

/***********************Schema 配置*********************/
const querySchemas = computed<SchemaFormItem[]>(() => [
  {
    component: 'input',
    field: 'keyword',
    label: '关键词',
    placeholder: '搜索用户名、昵称或手机号',
  },
  {
    component: 'select',
    field: 'roles',
    label: '角色',
    options: roleOptions.value,
  },
  {
    component: 'select',
    dictionary: 'status',
    field: 'status',
    label: '状态',
  },
])

const formSchemas = computed<SchemaFormItem[]>(() => [
  {
    component: 'tree-select',
    componentProps: {
      checkStrictly: true,
      data: organizationOptions.value,
      defaultExpandAll: true,
      props: { children: 'children', disabled: 'disabled', label: 'label', value: 'value' },
    },
    field: 'organizationId',
    label: '所属机构',
    options: organizationOptions.value,
    required: true,
    span: 12,
  },
  {
    component: 'input',
    field: 'username',
    label: '用户名',
    required: true,
    span: 12,
  },
  {
    component: 'input',
    field: 'nickname',
    label: '昵称',
    required: true,
    span: 12,
  },
  {
    component: 'select',
    componentProps: { multiple: true },
    field: 'roles',
    label: '角色',
    options: roleOptions.value,
    required: true,
    span: 12,
  },
  {
    component: 'select',
    defaultValue: 'enabled',
    dictionary: 'status',
    field: 'status',
    label: '状态',
    required: true,
    span: 12,
  },
  {
    component: 'input',
    field: 'phone',
    label: '手机号',
    span: 12,
  },
])

const columns = computed<SchemaTableColumn[]>(() => [
  { field: 'username', label: '用户名', width: 150 },
  { field: 'nickname', label: '昵称', width: 140 },
  {
    field: 'organizationId',
    formatter: value => organizationLabelMap.value.get(String(value ?? '')) ?? String(value ?? ''),
    label: '所属机构',
    minWidth: 190,
  },
  {
    field: 'roles',
    formatter: value => Array.isArray(value)
      ? value.map(role => roleOptions.value.find(option => option.value === role)?.label ?? role).join('、')
      : '',
    label: '角色',
    width: 180,
  },
  { dictionary: 'status', field: 'status', label: '状态', width: 100 },
  { field: 'phone', label: '手机号', width: 150 },
  { field: 'createdAt', label: '创建时间', width: 130 },
])
const queryConfig = computed(() => ({
  collapsible: true,
  columns: 3,
  schemas: querySchemas.value,
}))
const tableConfig = computed(() => ({
  columns: columns.value,
  rowKey: 'id',
  selection: true,
  showColumnSettings: true,
}))
const toolbarConfig = { batchDelete: false }

/***********************数据适配*********************/
function toUserRecord(row: SchemaTableRow): SystemUserRecord {
  return row as unknown as SystemUserRecord
}

function toUserInput(model: Partial<SchemaTableRow>): SaveSystemUserInput {
  return {
    nickname: model.nickname,
    organizationId: model.organizationId,
    phone: model.phone,
    roles: model.roles,
    status: model.status,
    username: model.username,
  }
}

const dataSource: CrudDataSource = {
  async create(model) {
    await createSystemUser(toUserInput(model))
    ElMessage.success('用户新增成功')
  },
  fetch(params) {
    const query = params.query as SystemUserQuery
    return fetchSystemUsers({
      page: params.page,
      pageSize: params.pageSize,
      query: { ...query, organizationId: selectedOrganizationId.value },
    })
  },
  async remove(row) {
    const user = toUserRecord(row)
    await deleteSystemUser(user.id)
    ElMessage.success(`已删除用户：${user.nickname}`)
  },
  async update(row, model) {
    const user = toUserRecord(row)
    await updateSystemUser(user.id, toUserInput(model))
    ElMessage.success('用户信息已更新')
  },
}

function toOrganizationTreeNode(option: SystemOrganizationOption): OrganizationTreeNode {
  return {
    children: option.children?.map(toOrganizationTreeNode),
    label: option.label,
    value: option.value,
  }
}

function collectOrganizationLabels(
  options: SystemOrganizationOption[],
  labels: Map<string, string>,
): void {
  options.forEach((option) => {
    labels.set(option.value, option.label)
    if (option.children) {
      collectOrganizationLabels(option.children, labels)
    }
  })
}

/***********************交互处理*********************/
function openView(row: SchemaTableRow): void {
  crudTableRef.value?.openView(row)
}

function openEdit(row: SchemaTableRow): void {
  crudTableRef.value?.openEdit(row)
}

function removeUser(row: SchemaTableRow): void {
  void crudTableRef.value?.removeRow(row)
}

async function toggleUserStatus(row: SchemaTableRow): Promise<void> {
  const user = toUserRecord(row)
  const nextStatus = user.status === 'enabled' ? 'disabled' : 'enabled'
  const action = nextStatus === 'enabled' ? '启用' : '停用'

  try {
    await ElMessageBox.confirm(`确定${action}用户“${user.nickname}”吗？`, `${action}确认`, {
      confirmButtonText: action,
      cancelButtonText: '取消',
      type: 'warning',
    })
  }
  catch {
    return
  }

  await updateSystemUserStatus(user.id, nextStatus)
  await crudTableRef.value?.reload()
  ElMessage.success(`用户已${action}`)
}

function openRoleAssignment(row: SchemaTableRow): void {
  const user = toUserRecord(row)
  assigningUsers.value = [user]
  batchRoleAssignment.value = false
  roleAssignmentClearSelection = undefined
  roleAssignmentModel.value = { roles: [...user.roles] }
  roleAssignmentError.value = ''
  roleAssignmentVisible.value = true
}

async function saveRoleAssignment(model: SchemaFormModel): Promise<void> {
  if (assigningUsers.value.length === 0) {
    return
  }

  roleAssignmentSaving.value = true
  roleAssignmentError.value = ''

  try {
    const roles = Array.isArray(model.roles) ? model.roles.map(String) : []
    if (batchRoleAssignment.value) {
      await updateSystemUsersRoles(
        assigningUsers.value.map(user => user.id),
        roles,
        model.mode as SystemUserRoleAssignmentMode,
      )
      roleAssignmentClearSelection?.()
    }
    else {
      await updateSystemUserRoles(assigningUsers.value[0].id, roles)
    }
    roleAssignmentVisible.value = false
    await crudTableRef.value?.reload()
    ElMessage.success(batchRoleAssignment.value ? `已更新 ${assigningUsers.value.length} 个用户的角色` : '用户角色已更新')
  }
  catch (error) {
    roleAssignmentError.value = error instanceof Error ? error.message : '角色分配失败'
  }
  finally {
    roleAssignmentSaving.value = false
  }
}

function filterOrganizationNode(keyword: string, data: { label?: unknown }): boolean {
  return !keyword || String(data.label ?? '').toLocaleLowerCase().includes(keyword.trim().toLocaleLowerCase())
}

function handleOrganizationSearch(keyword: string): void {
  organizationKeyword.value = keyword
  organizationTreeRef.value?.filter(keyword)
}

async function selectOrganization(node: OrganizationTreeNode): Promise<void> {
  selectedOrganizationId.value = node.value
  queryModel.value = { ...queryModel.value, organizationId: node.value }
  page.value = 1
  await crudTableRef.value?.reload()
}

async function handleBatchStatus(
  rows: SchemaTableRow[],
  clearSelection: ClearSelection,
  status: SystemUserStatus,
): Promise<void> {
  if (rows.length === 0) {
    ElMessage.warning('请先选择用户')
    return
  }

  const action = status === 'enabled' ? '启用' : '停用'
  try {
    await ElMessageBox.confirm(`确定批量${action}已选的 ${rows.length} 个用户吗？`, `批量${action}`, {
      cancelButtonText: '取消',
      confirmButtonText: action,
      type: 'warning',
    })
  }
  catch {
    return
  }

  try {
    await updateSystemUsersStatus(rows.map(row => toUserRecord(row).id), status)
    clearSelection()
    await crudTableRef.value?.reload()
    ElMessage.success(`已${action} ${rows.length} 个用户`)
  }
  catch (error) {
    ElMessage.error(error instanceof Error ? error.message : `批量${action}失败`)
  }
}

function openBatchRoleAssignment(rows: SchemaTableRow[], clearSelection: ClearSelection): void {
  if (rows.length === 0) {
    ElMessage.warning('请先选择用户')
    return
  }

  assigningUsers.value = rows.map(toUserRecord)
  batchRoleAssignment.value = true
  roleAssignmentClearSelection = clearSelection
  roleAssignmentModel.value = { mode: 'append', roles: [] }
  roleAssignmentError.value = ''
  roleAssignmentVisible.value = true
}

function handleBatchCommand(
  command: BatchCommand,
  rows: SchemaTableRow[],
  clearSelection: ClearSelection,
): void {
  if (command === 'assign-roles') {
    openBatchRoleAssignment(rows, clearSelection)
    return
  }

  void handleBatchStatus(rows, clearSelection, command === 'enable' ? 'enabled' : 'disabled')
}

function resolveSelectedRows(scope: unknown): SchemaTableRow[] {
  const rows = (scope as { selectedRows?: unknown }).selectedRows
  return Array.isArray(rows) ? rows as SchemaTableRow[] : []
}

function resolveClearSelection(scope: unknown): ClearSelection {
  const clearSelection = (scope as { clearSelection?: unknown }).clearSelection
  return typeof clearSelection === 'function' ? clearSelection as ClearSelection : () => {}
}

async function resetPassword(row: SchemaTableRow): Promise<void> {
  const user = toUserRecord(row)

  try {
    await ElMessageBox.confirm(`确定重置用户“${user.nickname}”的密码吗？`, '重置密码', {
      confirmButtonText: '重置',
      cancelButtonText: '取消',
      type: 'warning',
    })
  }
  catch {
    return
  }

  const result = await resetSystemUserPassword(user.id)
  await ElMessageBox.alert(`临时密码：${result.temporaryPassword}`, '密码已重置', {
    confirmButtonText: '我知道了',
  })
}

async function confirmRemove(rows: SchemaTableRow[]): Promise<boolean> {
  const label = rows.length === 1 ? toUserRecord(rows[0]).nickname : `${rows.length} 个用户`

  try {
    await ElMessageBox.confirm(`确定删除 ${label} 吗？`, '删除确认', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
    return true
  }
  catch {
    return false
  }
}

const actionsConfig = {
  confirmRemove,
}

const roleAssignmentSchemas = computed<SchemaFormItem[]>(() => [
  ...(batchRoleAssignment.value
    ? [{
        component: 'radio' as const,
        defaultValue: 'append',
        field: 'mode',
        label: '分配方式',
        options: [
          { label: '追加角色', value: 'append' },
          { label: '替换角色', value: 'replace' },
        ],
        required: true,
        span: 24,
      }]
    : []),
  {
    component: 'select',
    componentProps: { multiple: true },
    field: 'roles',
    label: '角色',
    options: roleOptions.value,
    required: true,
    span: 24,
  },
])

onMounted(() => {
  void Promise.all([
    fetchSystemRoleOptions(),
    fetchSystemOrganizationOptions(),
  ]).then(([roles, organizations]) => {
    roleOptions.value = roles
    organizationOptions.value = organizations
  }).catch((error) => {
    ElMessage.error(error instanceof Error ? error.message : '用户管理选项加载失败')
  })
})
</script>

<template>
  <main class="luma-admin-page luma-admin-user-page">
    <aside class="luma-admin-user-page__organizations" aria-label="机构筛选">
      <h2>机构导航</h2>
      <ElInput
        :model-value="organizationKeyword"
        clearable
        placeholder="搜索机构名称或编码"
        aria-label="搜索机构名称或编码"
        @update:model-value="handleOrganizationSearch"
      />
      <div class="luma-admin-user-page__organization-tree">
        <ElTree
          ref="organizationTreeRef"
          :data="organizationTree"
          node-key="value"
          default-expand-all
          highlight-current
          :current-node-key="selectedOrganizationId"
          :expand-on-click-node="false"
          :filter-node-method="filterOrganizationNode"
          :props="{ children: 'children', label: 'label' }"
          @node-click="selectOrganization"
        />
      </div>
    </aside>

    <LumaCrudTable
      ref="crudTableRef"
      v-model:query-model="queryModel"
      v-model:page="page"
      v-model:page-size="pageSize"
      title="用户管理"
      :actions="actionsConfig"
      :data-source="dataSource"
      :form-schemas="formSchemas"
      :query="queryConfig"
      :table="tableConfig"
      :toolbar="toolbarConfig"
    >
      <template #create-action="{ openCreate }">
        <ElButton
          v-authority="adminPermissionCodes.systemUserCreate"
          type="primary"
          native-type="button"
          data-action="create-user"
          @click="openCreate"
        >
          新增用户
        </ElButton>
      </template>

      <template #toolbar-actions="toolbarScope">
        <ElDropdown
          v-if="canUseBatchActions"
          :disabled="resolveSelectedRows(toolbarScope).length === 0"
          trigger="click"
          @command="command => handleBatchCommand(command, resolveSelectedRows(toolbarScope), resolveClearSelection(toolbarScope))"
        >
          <ElButton
            native-type="button"
            data-action="batch-user-actions"
            :disabled="resolveSelectedRows(toolbarScope).length === 0"
          >
            批量操作（{{ resolveSelectedRows(toolbarScope).length }}）
          </ElButton>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem
                v-if="canBatchStatus"
                command="enable"
                data-action="batch-enable-users"
              >
                批量启用
              </ElDropdownItem>
              <ElDropdownItem
                v-if="canBatchStatus"
                command="disable"
                data-action="batch-disable-users"
              >
                批量停用
              </ElDropdownItem>
              <ElDropdownItem
                v-if="canBatchAssignRoles"
                command="assign-roles"
                data-action="batch-assign-user-roles"
              >
                批量分配角色
              </ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
      </template>

      <template #row-actions="{ row }">
        <ElButton
          native-type="button"
          data-action="view-user"
          @click="openView(row)"
        >
          查看
        </ElButton>
        <ElButton
          v-authority="adminPermissionCodes.systemUserUpdate"
          native-type="button"
          data-action="edit-user"
          @click="openEdit(row)"
        >
          编辑
        </ElButton>
        <ElButton
          v-authority="adminPermissionCodes.systemUserStatus"
          native-type="button"
          data-action="toggle-user-status"
          @click="toggleUserStatus(row)"
        >
          {{ toUserRecord(row).status === 'enabled' ? '停用' : '启用' }}
        </ElButton>
        <ElButton
          v-authority="adminPermissionCodes.systemUserAssignRoles"
          native-type="button"
          data-action="assign-user-roles"
          @click="openRoleAssignment(row)"
        >
          分配角色
        </ElButton>
        <ElButton
          v-authority="adminPermissionCodes.systemUserResetPassword"
          native-type="button"
          data-action="reset-user-password"
          @click="resetPassword(row)"
        >
          重置密码
        </ElButton>
        <ElButton
          v-authority="adminPermissionCodes.systemUserDelete"
          type="danger"
          native-type="button"
          data-action="delete-user"
          @click="removeUser(row)"
        >
          删除
        </ElButton>
      </template>
    </LumaCrudTable>

    <ElDialog
      v-model="roleAssignmentVisible"
      append-to-body
      class="luma-admin-dialog"
      :title="roleAssignmentTitle"
      width="520px"
    >
      <ElAlert
        v-if="roleAssignmentError"
        class="luma-admin-page__operation-error"
        :title="roleAssignmentError"
        type="error"
        show-icon
        :closable="false"
      />
      <LumaSchemaForm
        v-model="roleAssignmentModel"
        mode="edit"
        :schemas="roleAssignmentSchemas"
        :submit-loading="roleAssignmentSaving"
        show-actions
        submit-text="保存角色"
        @submit="saveRoleAssignment"
      />
    </ElDialog>
  </main>
</template>

<style scoped>
.luma-admin-user-page {
  display: grid;
  min-width: 0;
  align-items: start;
  gap: 16px;
  grid-template-columns: minmax(220px, 260px) minmax(0, 1fr);
}

.luma-admin-user-page__organizations {
  display: grid;
  min-width: 0;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--el-border-radius-base);
  background: var(--el-fill-color-blank);
}

.luma-admin-user-page__organizations h2 {
  margin: 0;
  color: var(--el-text-color-primary);
  font-size: var(--luma-font-size-base, 14px);
}

.luma-admin-user-page__organization-tree {
  max-height: calc(100vh - 300px);
  overflow: auto;
}

.luma-admin-user-page :deep(.luma-crud-table) {
  min-width: 0;
}

@media (max-width: 768px) {
  .luma-admin-user-page {
    grid-template-columns: minmax(0, 1fr);
  }

  .luma-admin-user-page__organization-tree {
    max-height: 240px;
  }
}
</style>
