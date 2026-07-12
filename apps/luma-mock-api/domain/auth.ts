import { resolveRolePermissions } from './permission'

export type AdminAccountKey = 'admin' | 'guest' | 'operator'

export interface AdminUser {
  id: string
  name: string
  permissions: string[]
  roles: string[]
  username: string
}

export interface AdminLoginRequest {
  account?: AdminAccountKey
  password?: string
  username: string
}

export interface AdminAccountPreset {
  description: string
  key: AdminAccountKey
  label: string
  password: string
  username: string
}

export interface MockAccount extends AdminAccountPreset {
  enabled: boolean
  user: AdminUser
}

/***********************账号数据*********************/
export const mockAccounts: Record<AdminAccountKey, MockAccount> = {
  admin: {
    description: '拥有系统管理、项目和示例区全部访问能力',
    enabled: true,
    key: 'admin',
    label: '超级管理员',
    password: 'luma123',
    username: 'admin',
    user: {
      id: '1',
      name: '超级管理员',
      permissions: resolveRolePermissions(['admin']),
      roles: ['admin'],
      username: 'admin',
    },
  },
  operator: {
    description: '负责项目、字典和常用运营工作，不具备系统管理权限',
    enabled: true,
    key: 'operator',
    label: '运营人员',
    password: 'luma123',
    username: 'operator',
    user: {
      id: '2',
      name: '运营人员',
      permissions: resolveRolePermissions(['operator']),
      roles: ['operator'],
      username: 'operator',
    },
  },
  guest: {
    description: '仅可访问工作台和基础示例，无系统管理操作权限',
    enabled: true,
    key: 'guest',
    label: '访客账号',
    password: 'luma123',
    username: 'guest',
    user: {
      id: '3',
      name: '访客账号',
      permissions: resolveRolePermissions(['guest']),
      roles: ['guest'],
      username: 'guest',
    },
  },
}

export const adminAccountOptions: AdminAccountPreset[] = Object.values(mockAccounts).map((account) => {
  const { enabled: _enabled, user: _user, ...preset } = account
  return preset
})

/***********************登录校验*********************/
function cloneUser(user: AdminUser): AdminUser {
  return {
    ...user,
    permissions: [...user.permissions],
    roles: [...user.roles],
  }
}

function resolveAccount(payload: AdminLoginRequest): MockAccount | undefined {
  if (payload.account) {
    return mockAccounts[payload.account]
  }

  return Object.values(mockAccounts).find(account => account.username === payload.username)
}

export function verifyMockAccount(payload: AdminLoginRequest): { key: AdminAccountKey, user: AdminUser } {
  const account = resolveAccount(payload)
  const password = payload.password || 'luma123'

  if (!account || account.username !== payload.username || account.password !== password) {
    throw new Error('账号或密码不正确')
  }

  if (!account.enabled) {
    throw new Error('账号已停用')
  }

  return {
    key: account.key,
    user: cloneUser({
      ...account.user,
      permissions: resolveRolePermissions(account.user.roles),
    }),
  }
}

export function updateMockAccountStatus(username: string, enabled: boolean): void {
  const account = Object.values(mockAccounts).find(item => item.username === username)
  if (account) {
    account.enabled = enabled
  }
}

export function updateMockAccountRoles(username: string, roles: string[]): void {
  const account = Object.values(mockAccounts).find(item => item.username === username)
  if (account) {
    account.user.roles = [...roles]
    account.user.permissions = resolveRolePermissions(roles)
  }
}

export function updateMockAccountName(username: string, name: string): void {
  const account = Object.values(mockAccounts).find(item => item.username === username)
  if (account) {
    account.user.name = name
  }
}

export function resetMockAccountPassword(username: string, password: string): void {
  const account = Object.values(mockAccounts).find(item => item.username === username)
  if (account) {
    account.password = password
  }
}

export function changeMockAccountPassword(username: string, currentPassword: string, newPassword: string): void {
  const account = Object.values(mockAccounts).find(item => item.username === username)

  if (!account || account.password !== currentPassword) {
    throw new Error('当前密码不正确')
  }

  account.password = newPassword
}

export function resetMockAccounts(): void {
  const defaults: Record<AdminAccountKey, string[]> = {
    admin: ['admin'],
    guest: ['guest'],
    operator: ['operator'],
  }
  const names: Record<AdminAccountKey, string> = {
    admin: '超级管理员',
    guest: '访客账号',
    operator: '运营人员',
  }

  Object.values(mockAccounts).forEach((account) => {
    account.enabled = true
    account.password = 'luma123'
    account.user.name = names[account.key]
    account.user.roles = [...defaults[account.key]]
    account.user.permissions = resolveRolePermissions(account.user.roles)
  })
}

export function exportMockAccounts(): Record<AdminAccountKey, MockAccount> {
  return Object.fromEntries(Object.entries(mockAccounts).map(([key, account]) => [
    key,
    {
      ...account,
      user: cloneUser(account.user),
    },
  ])) as Record<AdminAccountKey, MockAccount>
}

export function importMockAccounts(accounts: Record<AdminAccountKey, MockAccount>): void {
  Object.entries(accounts).forEach(([key, account]) => {
    mockAccounts[key as AdminAccountKey] = {
      ...account,
      user: cloneUser(account.user),
    }
  })
}
