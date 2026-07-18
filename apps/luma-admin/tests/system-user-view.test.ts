import type { SchemaTableRow } from '@luma/core/components'
import { createAuthorityDirective } from '@luma/core/directives'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { adminPermissionCodes } from '../src/api/permissions'
import { permissionStore } from '../src/services/permission'
import { login, logout } from '../src/services/session'
import UserView from '../src/views/system/UserView.vue'

const sampleUser = {
  createdAt: '2026-01-15',
  id: 'user-1',
  nickname: '超级管理员',
  organizationId: 'organization-1',
  phone: '13800138001',
  role: 'admin',
  roles: ['admin'],
  status: 'enabled',
  username: 'admin',
}
const secondUser = {
  ...sampleUser,
  id: 'user-2',
  nickname: '运营管理员',
  organizationId: 'organization-5',
  role: 'operator',
  roles: ['operator'],
  username: 'operator',
}

let selectedUsers: SchemaTableRow[] = [sampleUser, secondUser]
const clearSelection = vi.fn()
const reload = vi.fn().mockResolvedValue(undefined)
const filterOrganizations = vi.fn()

const ButtonStub = defineComponent({
  name: 'ElButton',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => h('button', attrs, slots.default?.())
  },
})

const CrudTableStub = defineComponent({
  name: 'LumaCrudTable',
  props: {
    dataSource: Object,
    formSchemas: Array,
    query: Object,
    table: Object,
    toolbar: Object,
  },
  setup(_, { expose, slots }) {
    const openCreate = vi.fn()
    const openEdit = vi.fn()
    const openView = vi.fn()
    const removeRow = vi.fn().mockResolvedValue(undefined)

    expose({ clearSelection, openEdit, openView, reload, removeRow })

    return () => h('section', { class: 'crud-table-stub' }, [
      slots['create-action']?.({ openCreate }),
      slots['toolbar-actions']?.({
        clearSelection,
        openCreate,
        reload,
        selectedRowKeys: selectedUsers.map(user => String(user.id)),
        selectedRows: selectedUsers,
      }),
      slots['row-actions']?.({ index: 0, row: sampleUser }),
    ])
  },
})

const DialogStub = defineComponent({
  name: 'ElDialog',
  props: { modelValue: Boolean, title: String },
  emits: ['update:modelValue'],
  setup(props, { slots }) {
    return () => props.modelValue
      ? h('section', { 'class': 'dialog-stub', 'data-title': props.title }, slots.default?.())
      : null
  },
})

const DropdownStub = defineComponent({
  name: 'ElDropdown',
  props: { disabled: Boolean },
  emits: ['command'],
  setup(props, { attrs, slots }) {
    return () => h('div', { ...attrs, 'class': 'dropdown-stub', 'data-disabled': String(props.disabled) }, [
      slots.default?.(),
      slots.dropdown?.(),
    ])
  },
})

const DropdownItemStub = defineComponent({
  name: 'ElDropdownItem',
  inheritAttrs: false,
  props: { command: String },
  setup(_, { attrs, slots }) {
    return () => h('button', attrs, slots.default?.())
  },
})

const SchemaFormStub = defineComponent({
  name: 'LumaSchemaForm',
  props: { schemas: Array },
  emits: ['submit', 'update:modelValue'],
  setup(_, { slots }) {
    return () => h('form', { class: 'schema-form-stub' }, slots.default?.())
  },
})

const TreeStub = defineComponent({
  name: 'ElTree',
  props: { data: Array },
  emits: ['nodeClick'],
  setup(props, { emit, expose }) {
    expose({ filter: filterOrganizations })

    function renderNodes(nodes: unknown[]): ReturnType<typeof h>[] {
      return nodes.flatMap((item) => {
        const node = item as { children?: unknown[], label: string, value: string }
        return [
          h('button', {
            'data-organization-id': node.value || 'all',
            'onClick': () => emit('nodeClick', node),
            'type': 'button',
          }, node.label),
          ...renderNodes(node.children ?? []),
        ]
      })
    }

    return () => h('div', { class: 'tree-stub' }, renderNodes(props.data ?? []))
  },
})

async function flushPromises(): Promise<void> {
  await Promise.resolve()
  await new Promise(resolve => setTimeout(resolve, 25))
  await nextTick()
  await Promise.resolve()
  await nextTick()
}

function setViewportWidth(width: number): void {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: width,
    writable: true,
  })
  window.dispatchEvent(new Event('resize'))
}

function mountUserView() {
  return mount(UserView, {
    global: {
      directives: {
        authority: createAuthorityDirective(permissionStore),
      },
      stubs: {
        ElButton: ButtonStub,
        ElDialog: DialogStub,
        ElDropdown: DropdownStub,
        ElDropdownItem: DropdownItemStub,
        ElDropdownMenu: defineComponent({ setup(_, { slots }) { return () => h('div', slots.default?.()) } }),
        ElTree: TreeStub,
        LumaCrudTable: CrudTableStub,
        LumaSchemaForm: SchemaFormStub,
      },
    },
  })
}

describe('system user view', () => {
  beforeEach(async () => {
    setViewportWidth(1024)
    await login('admin')
    permissionStore.clear()
    selectedUsers = [sampleUser, secondUser]
    clearSelection.mockClear()
    reload.mockClear()
    filterOrganizations.mockClear()
  })

  afterEach(async () => {
    await logout()
  })

  it('配置机构字段、选择列、查询条件和标准 dataSource', async () => {
    permissionStore.setPermissions(resolveUserPermissions())
    const wrapper = mountUserView()
    await flushPromises()

    const crudTable = wrapper.findComponent(CrudTableStub)
    const table = crudTable.props('table') as { columns: { field: string }[], mobileActionWidth: number, selection: boolean, showColumnSettings: boolean }
    const toolbar = crudTable.props('toolbar') as { batchDelete: boolean }
    const query = crudTable.props('query') as { mobileDefaultVisible: boolean, schemas: { field: string }[] }
    const formSchemas = crudTable.props('formSchemas') as { component: string, field: string, required?: boolean }[]
    const dataSource = crudTable.props('dataSource') as Record<string, unknown>

    expect(table.columns.map(column => column.field)).toEqual([
      'username',
      'nickname',
      'organizationId',
      'roles',
      'status',
      'phone',
      'createdAt',
    ])
    expect(query.schemas.map(schema => schema.field)).toEqual(['keyword', 'roles', 'status'])
    expect(query.mobileDefaultVisible).toBe(false)
    expect(table.mobileActionWidth).toBe(72)
    expect(table.selection).toBe(true)
    expect(table.showColumnSettings).toBe(true)
    expect(toolbar.batchDelete).toBe(false)
    expect(formSchemas.map(schema => schema.field)).toEqual(['organizationId', 'username', 'nickname', 'roles', 'status', 'phone'])
    expect(formSchemas.find(schema => schema.field === 'organizationId')).toMatchObject({ component: 'tree-select', required: true })
    expect(Object.keys(dataSource).sort()).toEqual(['create', 'fetch', 'remove', 'update'])
  })

  it('按机构名称或编码搜索并选择机构子树筛选用户', async () => {
    permissionStore.setPermissions(resolveUserPermissions())
    const wrapper = mountUserView()
    await flushPromises()

    const input = wrapper.find('input[aria-label="搜索机构名称或编码"]')
    await input.setValue('platform-rd')
    expect(filterOrganizations).toHaveBeenCalledWith('platform-rd')

    await wrapper.find('[data-organization-id="organization-2"]').trigger('click')
    expect(reload).toHaveBeenCalled()

    const dataSource = wrapper.findComponent(CrudTableStub).props('dataSource') as {
      fetch: (params: { page: number, pageSize: number, query: Record<string, unknown> }) => Promise<{ items: typeof sampleUser[] }>
    }
    const result = await dataSource.fetch({ page: 1, pageSize: 10, query: {} })
    expect(result.items.every(user => ['organization-2', 'organization-3', 'organization-4'].includes(user.organizationId))).toBe(true)
  })

  it('移动端默认收起机构面板并在视口切换后保留移动端选择', async () => {
    setViewportWidth(375)
    permissionStore.setPermissions(resolveUserPermissions())
    const wrapper = mountUserView()
    await flushPromises()

    const panel = wrapper.get('#user-organization-panel')
    const openButton = wrapper.get('button[aria-label="展开机构导航"]')
    expect(wrapper.get('.luma-admin-user-page__organization-summary').text()).toContain('当前机构：全部机构')
    expect(openButton.attributes('aria-expanded')).toBe('false')
    expect(panel.isVisible()).toBe(false)

    await openButton.trigger('click')
    expect(wrapper.get('button[aria-label="收起机构导航"]').attributes('aria-expanded')).toBe('true')
    expect(panel.isVisible()).toBe(true)
    expect(wrapper.get('input[aria-label="搜索机构名称或编码"]').isVisible()).toBe(true)

    await wrapper.get('[data-organization-id="organization-2"]').trigger('click')
    expect(wrapper.get('.luma-admin-user-page__organization-summary').text()).toContain('平台研发中心')

    await wrapper.get('button[aria-label="收起机构导航"]').trigger('click')
    expect(panel.isVisible()).toBe(false)

    setViewportWidth(1024)
    await nextTick()
    expect(panel.isVisible()).toBe(true)
    expect(wrapper.find('.luma-admin-user-page__organization-toggle').exists()).toBe(false)

    setViewportWidth(375)
    await nextTick()
    expect(panel.isVisible()).toBe(false)
    expect(wrapper.get('button[aria-label="展开机构导航"]').attributes('aria-expanded')).toBe('false')
  })

  it('批量分配角色默认追加，成功后清空选择并刷新', async () => {
    permissionStore.setPermissions(resolveUserPermissions())
    const wrapper = mountUserView()
    await flushPromises()

    wrapper.findComponent(DropdownStub).vm.$emit('command', 'assign-roles')
    await nextTick()
    expect(wrapper.find('.dialog-stub').attributes('data-title')).toContain('已选 2 人')

    const schemaForm = wrapper.findComponent(SchemaFormStub)
    const schemas = schemaForm.props('schemas') as { defaultValue?: string, field: string }[]
    expect(schemas.find(schema => schema.field === 'mode')?.defaultValue).toBe('append')
    schemaForm.vm.$emit('submit', { mode: 'append', roles: ['guest'] })
    await flushPromises()

    expect(clearSelection).toHaveBeenCalledOnce()
    expect(reload).toHaveBeenCalledOnce()
    expect(wrapper.find('.dialog-stub').exists()).toBe(false)
  })

  it('批量分配失败时保留选择和对话框', async () => {
    permissionStore.setPermissions(resolveUserPermissions())
    selectedUsers = [sampleUser, { ...secondUser, id: 'missing-user' }]
    const wrapper = mountUserView()
    await flushPromises()

    wrapper.findComponent(DropdownStub).vm.$emit('command', 'assign-roles')
    await nextTick()
    wrapper.findComponent(SchemaFormStub).vm.$emit('submit', { mode: 'replace', roles: ['guest'] })
    await flushPromises()

    expect(clearSelection).not.toHaveBeenCalled()
    expect(reload).not.toHaveBeenCalled()
    expect(wrapper.find('.dialog-stub').exists()).toBe(true)
    expect(wrapper.text()).toContain('用户不存在')
  })

  it('使用 v-authority 隐藏没有权限的新增、批量、编辑和删除按钮', () => {
    permissionStore.setPermissions([adminPermissionCodes.systemUserList])
    const wrapper = mountUserView()

    expect(wrapper.find('[data-action="view-user"]').attributes('style')).toBeUndefined()
    expect(wrapper.find('[data-action="create-user"]').attributes('style')).toContain('display: none')
    expect(wrapper.find('[data-action="batch-user-actions"]').exists()).toBe(false)
    expect(wrapper.find('[data-action="edit-user"]').attributes('style')).toContain('display: none')
    expect(wrapper.find('[data-action="toggle-user-status"]').attributes('style')).toContain('display: none')
    expect(wrapper.find('[data-action="assign-user-roles"]').attributes('style')).toContain('display: none')
    expect(wrapper.find('[data-action="reset-user-password"]').attributes('style')).toContain('display: none')
    expect(wrapper.find('[data-action="delete-user"]').attributes('style')).toContain('display: none')
  })

  it('拥有系统用户操作权限时显示对应按钮', () => {
    permissionStore.setPermissions(resolveUserPermissions())
    const wrapper = mountUserView()

    expect(wrapper.find('[data-action="create-user"]').attributes('style')).toBeUndefined()
    expect(wrapper.find('[data-action="batch-user-actions"]').exists()).toBe(true)
    expect(wrapper.find('[data-action="edit-user"]').attributes('style')).toBeUndefined()
    expect(wrapper.find('[data-action="toggle-user-status"]').attributes('style')).toBeUndefined()
    expect(wrapper.find('[data-action="assign-user-roles"]').attributes('style')).toBeUndefined()
    expect(wrapper.find('[data-action="reset-user-password"]').attributes('style')).toBeUndefined()
    expect(wrapper.find('[data-action="delete-user"]').attributes('style')).toBeUndefined()
  })
})

function resolveUserPermissions(): string[] {
  return [
    adminPermissionCodes.systemUserList,
    adminPermissionCodes.systemUserCreate,
    adminPermissionCodes.systemUserUpdate,
    adminPermissionCodes.systemUserDelete,
    adminPermissionCodes.systemUserStatus,
    adminPermissionCodes.systemUserAssignRoles,
    adminPermissionCodes.systemUserResetPassword,
  ]
}
