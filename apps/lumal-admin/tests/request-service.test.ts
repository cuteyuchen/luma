import { afterEach, describe, expect, it } from 'vitest'
import { createAdminRequestClient } from '../src/services/request'
import { adminSession, currentUser, login, logout } from '../src/services/session'

describe('admin request service', () => {
  afterEach(async () => {
    await logout()
  })

  it('通过 Admin adapter 识别业务会话码，刷新后重放 GET', async () => {
    await login('admin')
    adminSession.setSession({
      accessToken: 'expired-access',
      refreshToken: adminSession.getRefreshToken(),
    })
    const request = createAdminRequestClient()

    await expect(request.get('/session/me')).resolves.toMatchObject({ username: 'admin' })
    expect(adminSession.getToken()).not.toBe('expired-access')
    expect(adminSession.getToken()).toBeTruthy()
    expect(currentUser.value?.username).toBe('admin')
  })

  it('刷新失败时清理会话、用户和权限状态', async () => {
    await login('operator')
    adminSession.setSession({
      accessToken: 'expired-access',
      refreshToken: 'invalid-refresh',
    })
    const request = createAdminRequestClient()

    await expect(request.get('/profile')).rejects.toMatchObject({ kind: 'session' })
    expect(adminSession.getSession()).toBeNull()
    expect(currentUser.value).toBeNull()
  })
})
