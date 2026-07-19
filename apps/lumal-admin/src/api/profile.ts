import type { SystemUserStatus } from './system'
import { adminRequest } from '../services/request'

export interface AdminProfile { id: string, nickname: string, phone: string, roles: string[], status: SystemUserStatus, username: string }
export interface UpdateAdminProfileInput { nickname: string, phone: string }
export interface ChangeAdminPasswordInput { currentPassword: string, newPassword: string }

export function fetchAdminProfile(_username: string): Promise<AdminProfile> {
  return adminRequest.get('/profile')
}

export function updateAdminProfile(_username: string, input: UpdateAdminProfileInput): Promise<AdminProfile> {
  return adminRequest.put('/profile', { body: { ...input }, retryOnAuthRefresh: true })
}

export async function changeAdminPassword(_username: string, input: ChangeAdminPasswordInput): Promise<void> {
  await adminRequest.put('/profile/password', { body: { ...input }, retryOnAuthRefresh: true })
}
