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

export interface AdminLoginResult {
  token: string
  user: AdminUser
}

export interface AdminAccountPreset {
  description: string
  key: AdminAccountKey
  label: string
  password: string
  username: string
}

interface MockAccount extends AdminAccountPreset {
  user: AdminUser
}

/***********************权限常量*********************/
const adminPermissions = [
  'dashboard:view',
  'system:user:list',
  'system:user:create',
  'system:user:update',
  'system:user:delete',
  'system:role:list',
  'system:role:create',
  'system:role:update',
  'system:role:delete',
  'system:role:authorize',
  'system:menu:list',
  'system:menu:create',
  'system:menu:update',
  'system:menu:delete',
  'system:dict:list',
  'system:dict:create',
  'system:dict:update',
  'system:dict:delete',
  'system:config:view',
  'project:list',
  'examples:view',
  'examples:dictionary',
]

const operatorPermissions = [
  'dashboard:view',
  'project:list',
  'system:dict:list',
  'examples:view',
  'examples:dictionary',
]

const guestPermissions = [
  'dashboard:view',
  'examples:view',
]

/***********************账号数据*********************/
export const mockAccounts: Record<AdminAccountKey, MockAccount> = {
  admin: {
    description: '拥有系统管理、项目和示例区全部访问能力',
    key: 'admin',
    label: '超级管理员',
    password: 'luma123',
    username: 'admin',
    user: {
      id: '1',
      name: '超级管理员',
      permissions: adminPermissions,
      roles: ['admin'],
      username: 'admin',
    },
  },
  operator: {
    description: '负责项目和字典维护，可访问常用能力示例',
    key: 'operator',
    label: '运营人员',
    password: 'luma123',
    username: 'operator',
    user: {
      id: '2',
      name: '运营人员',
      permissions: operatorPermissions,
      roles: ['operator'],
      username: 'operator',
    },
  },
  guest: {
    description: '只保留工作台和基础示例访问能力',
    key: 'guest',
    label: '访客账号',
    password: 'luma123',
    username: 'guest',
    user: {
      id: '3',
      name: '访客账号',
      permissions: guestPermissions,
      roles: ['guest'],
      username: 'guest',
    },
  },
}

export const adminAccountOptions: AdminAccountPreset[] = Object.values(mockAccounts).map((account) => {
  const { user: _user, ...preset } = account
  return preset
})

/***********************登录接口模拟*********************/
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

export async function mockLogin(payload: AdminLoginRequest): Promise<AdminLoginResult> {
  const account = resolveAccount(payload)
  const password = payload.password || 'luma123'

  if (!account || account.username !== payload.username || account.password !== password) {
    throw new Error('账号或密码不正确')
  }

  return {
    token: `mock-token-${account.key}`,
    user: cloneUser(account.user),
  }
}
