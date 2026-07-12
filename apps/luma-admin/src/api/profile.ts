import type { SystemUserStatus } from './system'
import { changeMockAccountPassword } from '../mock/auth'
import { fetchSystemUsers, updateSystemUser } from './system'

export interface AdminProfile {
  id: string
  nickname: string
  phone: string
  roles: string[]
  status: SystemUserStatus
  username: string
}

export interface UpdateAdminProfileInput {
  nickname: string
  phone: string
}

export interface ChangeAdminPasswordInput {
  currentPassword: string
  newPassword: string
}

async function findProfile(username: string): Promise<AdminProfile> {
  const result = await fetchSystemUsers({
    page: 1,
    pageSize: 100,
    query: { keyword: username },
  })
  const user = result.items.find(item => item.username === username)

  if (!user) {
    throw new Error('当前用户资料不存在')
  }

  return user
}

export function fetchAdminProfile(username: string): Promise<AdminProfile> {
  return findProfile(username)
}

export async function updateAdminProfile(
  username: string,
  input: UpdateAdminProfileInput,
): Promise<AdminProfile> {
  const nickname = input.nickname.trim()
  const phone = input.phone.trim()

  if (!nickname) {
    throw new Error('昵称不能为空')
  }

  if (nickname.length > 32) {
    throw new Error('昵称不能超过 32 个字符')
  }

  if (phone && !/^1\d{10}$/.test(phone)) {
    throw new Error('请输入正确的 11 位手机号')
  }

  const current = await findProfile(username)
  return updateSystemUser(current.id, {
    nickname,
    phone,
    roles: current.roles,
    status: current.status,
    username: current.username,
  })
}

export async function changeAdminPassword(
  username: string,
  input: ChangeAdminPasswordInput,
): Promise<void> {
  if (!input.currentPassword) {
    throw new Error('请输入当前密码')
  }

  if (input.newPassword.length < 8 || input.newPassword.length > 32) {
    throw new Error('新密码长度需为 8 到 32 位')
  }

  if (input.currentPassword === input.newPassword) {
    throw new Error('新密码不能与当前密码相同')
  }

  changeMockAccountPassword(username, input.currentPassword, input.newPassword)
}
