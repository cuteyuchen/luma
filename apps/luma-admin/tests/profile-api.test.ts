import { afterEach, describe, expect, it } from 'vitest'
import {
  changeAdminPassword,
  fetchAdminProfile,
  updateAdminProfile,
} from '../src/api/profile'
import { login, logout } from '../src/services/session'

describe('admin profile api', () => {
  afterEach(async () => {
    await logout()
  })

  it('读取并更新当前账号资料，同时同步后续登录昵称', async () => {
    await login('admin')
    await expect(fetchAdminProfile('admin')).resolves.toMatchObject({
      nickname: '超级管理员',
      phone: '13800138001',
      roles: ['admin'],
      username: 'admin',
    })

    await updateAdminProfile('admin', {
      nickname: '平台管理员',
      phone: '13900139000',
    })

    await expect(fetchAdminProfile('admin')).resolves.toMatchObject({
      nickname: '平台管理员',
      phone: '13900139000',
    })
  })

  it('拒绝无效手机号和错误的当前密码', async () => {
    await login('admin')
    await expect(updateAdminProfile('admin', {
      nickname: '管理员',
      phone: '123',
    })).rejects.toThrow('请输入正确的 11 位手机号')

    await expect(changeAdminPassword('admin', {
      currentPassword: 'wrong-password',
      newPassword: 'NewPassword123',
    })).rejects.toThrow('当前密码不正确')
  })

  it('修改密码后旧密码失效且新密码可登录', async () => {
    await login('admin')
    await changeAdminPassword('admin', {
      currentPassword: 'luma123',
      newPassword: 'NewPassword123',
    })

    await expect(changeAdminPassword('admin', {
      currentPassword: 'luma123',
      newPassword: 'AnotherPassword123',
    })).rejects.toThrow('当前密码不正确')
    await expect(changeAdminPassword('admin', {
      currentPassword: 'NewPassword123',
      newPassword: 'AnotherPassword123',
    })).resolves.toBeUndefined()
  })
})
