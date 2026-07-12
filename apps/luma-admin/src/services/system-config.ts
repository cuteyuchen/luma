import type { AdminSystemConfig } from './preferences'
import { updateAdminSystemConfig } from './preferences'
import { adminRequest } from './request'

export async function fetchAdminSystemConfig(): Promise<AdminSystemConfig> {
  return updateAdminSystemConfig(await adminRequest.get('/system/config'))
}

export async function saveAdminSystemConfig(config: AdminSystemConfig): Promise<AdminSystemConfig> {
  return updateAdminSystemConfig(await adminRequest.put('/system/config', { body: { ...config }, retryOnAuthRefresh: true }))
}

export async function restoreAdminSystemConfig(): Promise<AdminSystemConfig> {
  return updateAdminSystemConfig(await adminRequest.post('/system/config/restore', { retryOnAuthRefresh: true }))
}
