import type { AdminLoginRequest, AdminLoginResult } from '../mock/auth'
import { adminAccountOptions, mockLogin } from '../mock/auth'

/***********************账号预设*********************/
export { adminAccountOptions }
export type {
  AdminAccountKey,
  AdminAccountPreset,
  AdminLoginRequest,
  AdminLoginResult,
  AdminUser,
} from '../mock/auth'

/***********************登录接口*********************/
export function loginAdmin(payload: AdminLoginRequest): Promise<AdminLoginResult> {
  return mockLogin(payload)
}
