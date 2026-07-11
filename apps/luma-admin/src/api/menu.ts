import type { LumaMenuRecord } from '@luma/core/router'
import { mockLoadAdminMenus } from '../mock/menu'

/***********************菜单接口*********************/
export function loadAdminMenus(): Promise<LumaMenuRecord[]> {
  return mockLoadAdminMenus()
}
