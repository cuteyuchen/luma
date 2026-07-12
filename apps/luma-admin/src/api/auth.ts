import type { AuthSessionData } from '@luma/core/auth'
import type { AdminAccountPreset, AdminLoginRequest, AdminUser } from './types'
import { adminPublicRequest, adminRequest } from '../services/request'
import { parseAdminSession } from './adapters'

export interface AdminLoginResult { session: AuthSessionData, user: AdminUser }

export const adminAccountOptions: AdminAccountPreset[] = [
  { description: '拥有系统管理、项目和示例区全部访问能力', key: 'admin', label: '超级管理员', password: 'luma123', username: 'admin' },
  { description: '负责项目、字典和常用运营工作，不具备系统管理权限', key: 'operator', label: '运营人员', password: 'luma123', username: 'operator' },
  { description: '仅可访问工作台和基础示例，无系统管理操作权限', key: 'guest', label: '访客账号', password: 'luma123', username: 'guest' },
]

export type { AdminAccountKey, AdminAccountPreset, AdminLoginRequest, AdminUser } from './types'

export async function loginAdmin(payload: AdminLoginRequest): Promise<AdminLoginResult> {
  const result = await adminPublicRequest.post<Record<string, unknown>>('/auth/login', { body: { ...payload } })
  return { session: parseAdminSession(result), user: result.user as AdminUser }
}

export async function refreshAdminSession(refreshToken: string): Promise<AuthSessionData> {
  return parseAdminSession(await adminPublicRequest.post('/auth/refresh', { body: { refreshToken } }))
}

export async function logoutAdmin(): Promise<void> {
  await adminRequest.post('/auth/logout')
}
