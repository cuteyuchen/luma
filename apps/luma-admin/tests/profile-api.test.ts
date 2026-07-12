import { afterEach, describe, expect, it } from 'vitest'
import {
  changeAdminPassword,
  fetchAdminProfile,
  updateAdminProfile,
} from '../src/api/profile'
import { resetMockSystemUsers } from '../src/mock/system'
import { login, logout } from '../src/services/session'

describe('admin profile api', () => {
  afterEach(async () => {
    await logout()
    resetMockSystemUsers()
  })

  it('读取并更新当前账号资料，同时同步后续登录昵称', async () => {
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
    await expect(login('admin')).resolves.toMatchObject({ name: '平台管理员' })
  })

  it('拒绝无效手机号和错误的当前密码', async () => {
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
    await changeAdminPassword('admin', {
      currentPassword: 'luma123',
      newPassword: 'NewPassword123',
    })

    await expect(login('admin')).rejects.toThrow('账号或密码不正确')
    await expect(login({
      account: 'admin',
      password: 'NewPassword123',
      username: 'admin',
    })).resolves.toMatchObject({ username: 'admin' })
  })
})
