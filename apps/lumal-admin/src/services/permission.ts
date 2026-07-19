import { createPermissionStore } from '@lumal/core/permission'

export interface AdminAccessSnapshot {
  permissions: string[]
  roles: string[]
}

/***********************权限状态*********************/
export const permissionStore = createPermissionStore()

/***********************权限同步*********************/
export function syncAdminAccess(snapshot: AdminAccessSnapshot): void {
  permissionStore.setPermissions(snapshot.permissions)
  permissionStore.setRoles(snapshot.roles)
}

export function clearAdminAccess(): void {
  permissionStore.clear()
}
