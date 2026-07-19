import { beforeEach, describe, expect, it } from 'vitest'
import {
  mockBatchUpdateSystemUserRoles,
  mockBatchUpdateSystemUserStatus,
  mockCreateSystemOrganization,
  mockCreateSystemUser,
  mockDeleteSystemOrganization,
  mockFetchSystemOrganizationOptions,
  mockFetchSystemUsers,
  mockUpdateSystemOrganization,
  mockUpdateSystemUser,
  resetMockSystemOrganizations,
  resetMockSystemRoles,
  resetMockSystemUsers,
} from '../domain/system'

beforeEach(() => {
  resetMockSystemRoles()
  resetMockSystemOrganizations()
  resetMockSystemUsers()
})

describe('system users and organizations', () => {
  it('为初始用户保留机构归属并按机构子树筛选', async () => {
    const all = await mockFetchSystemUsers({ page: 1, pageSize: 20 })
    expect(Object.fromEntries(all.items.map(user => [user.id, user.organizationId]))).toEqual({
      'user-1': 'organization-1',
      'user-2': 'organization-5',
      'user-3': 'organization-1',
      'user-4': 'organization-2',
      'user-5': 'organization-4',
      'user-6': 'organization-5',
    })

    await expect(mockFetchSystemUsers({
      page: 1,
      pageSize: 20,
      query: { organizationId: 'organization-2' },
    })).resolves.toMatchObject({
      items: [
        expect.objectContaining({ id: 'user-4' }),
        expect.objectContaining({ id: 'user-5' }),
      ],
      total: 2,
    })
  })

  it('要求用户归属机构且只允许新增或调动到启用机构', async () => {
    await expect(mockCreateSystemUser({
      nickname: '未归属用户',
      roles: ['guest'],
      username: 'no-organization',
    })).rejects.toThrow('请选择所属机构')

    await mockUpdateSystemOrganization('organization-4', {
      status: 'disabled',
    })
    await expect(mockCreateSystemUser({
      nickname: '停用机构用户',
      organizationId: 'organization-4',
      roles: ['guest'],
      username: 'disabled-organization',
    })).rejects.toThrow('只能选择启用机构')
    await expect(mockUpdateSystemUser('user-4', {
      organizationId: 'organization-4',
    })).rejects.toThrow('只能选择启用机构')

    await expect(mockUpdateSystemUser('user-5', {
      nickname: '保留原机构的用户',
    })).resolves.toMatchObject({
      nickname: '保留原机构的用户',
      organizationId: 'organization-4',
    })
  })

  it('返回可搜索的精简机构树并标记停用节点', async () => {
    await mockUpdateSystemOrganization('organization-5', { status: 'disabled' })

    const options = await mockFetchSystemOrganizationOptions()
    expect(options).toEqual([
      expect.objectContaining({
        children: expect.any(Array),
        disabled: false,
        label: 'Lumal 总部（lumal-headquarters）',
        value: 'organization-1',
      }),
    ])
    expect(options[0]?.children?.find(item => item.value === 'organization-5')).toEqual({
      disabled: true,
      label: '产品运营中心（product-operation）',
      value: 'organization-5',
    })
  })

  it('拒绝删除仍有直属用户的机构', async () => {
    await expect(mockDeleteSystemOrganization('organization-4')).rejects.toThrow('该机构仍有直属用户，请先迁移用户')
    await expect(mockDeleteSystemOrganization('organization-3')).resolves.toBeUndefined()
  })

  it('批量启停对重复 ID 去重并在校验失败时不产生部分更新', async () => {
    await expect(mockBatchUpdateSystemUserStatus(
      ['user-2', 'user-2', 'user-6'],
      'disabled',
    )).resolves.toMatchObject({
      items: [
        expect.objectContaining({ id: 'user-2', status: 'disabled' }),
        expect.objectContaining({ id: 'user-6', status: 'disabled' }),
      ],
      updated: 2,
    })

    await expect(mockBatchUpdateSystemUserStatus(
      ['user-1', 'missing-user'],
      'disabled',
    )).rejects.toThrow('用户不存在')
    await expect(mockBatchUpdateSystemUserStatus(
      ['user-1'],
      'invalid' as 'enabled',
    )).rejects.toThrow('请选择有效状态')

    const users = await mockFetchSystemUsers({ page: 1, pageSize: 20 })
    expect(users.items.find(user => user.id === 'user-1')?.status).toBe('enabled')
  })

  it('批量角色支持追加和替换并在无效角色时原子回滚', async () => {
    await expect(mockBatchUpdateSystemUserRoles(
      ['user-2', 'user-2', 'user-6'],
      ['guest'],
      'append',
    )).resolves.toMatchObject({
      items: [
        expect.objectContaining({ id: 'user-2', roles: ['operator', 'guest'] }),
        expect.objectContaining({ id: 'user-6', roles: ['operator', 'guest'] }),
      ],
      updated: 2,
    })

    await expect(mockBatchUpdateSystemUserRoles(
      ['user-2', 'user-6'],
      ['guest'],
      'replace',
    )).resolves.toMatchObject({
      items: [
        expect.objectContaining({ id: 'user-2', roles: ['guest'] }),
        expect.objectContaining({ id: 'user-6', roles: ['guest'] }),
      ],
      updated: 2,
    })

    await expect(mockBatchUpdateSystemUserRoles(
      ['user-1', 'user-2'],
      ['missing-role'],
      'replace',
    )).rejects.toThrow('请选择有效角色')

    const users = await mockFetchSystemUsers({ page: 1, pageSize: 20 })
    expect(users.items.find(user => user.id === 'user-1')?.roles).toEqual(['admin'])
    expect(users.items.find(user => user.id === 'user-2')?.roles).toEqual(['guest'])
  })

  it('支持创建启用机构并将用户分配到该机构', async () => {
    const organization = await mockCreateSystemOrganization({
      code: 'quality-assurance',
      name: '质量保障组',
      parentId: 'organization-2',
      status: 'enabled',
    })
    const user = await mockCreateSystemUser({
      nickname: '质量工程师',
      organizationId: organization.id,
      roles: ['operator'],
      username: 'quality-engineer',
    })

    expect(user.organizationId).toBe(organization.id)
    await expect(mockFetchSystemUsers({
      page: 1,
      pageSize: 20,
      query: { organizationId: 'organization-2' },
    })).resolves.toMatchObject({ total: 3 })
  })
})
