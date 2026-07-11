import type { LumaMenuRecord } from '@luma/core/router'
import { adminRouteRecords } from '../router/routes'

function cloneMenu(record: LumaMenuRecord): LumaMenuRecord {
  return {
    ...record,
    children: record.children?.map(cloneMenu),
    meta: record.meta ? { ...record.meta } : undefined,
  }
}

/***********************菜单接口模拟*********************/
export async function mockLoadAdminMenus(): Promise<LumaMenuRecord[]> {
  return adminRouteRecords.map(cloneMenu)
}
