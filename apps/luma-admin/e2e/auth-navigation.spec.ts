import { expect, test } from '@playwright/test'
import { loginAsAdmin, openTopMenu, resetBrowserState } from './helpers'

test('登录后加载权限菜单并正确处理 403、404 与退出', async ({ page }) => {
  await resetBrowserState(page)
  await page.goto('/#/system/user')
  await expect(page).toHaveURL(/#\/login\?redirect=\/system\/user$/)

  await page.getByTestId('login-submit').click()
  await expect(page).toHaveURL(/#\/system\/user$/)
  await expect(page.getByRole('heading', { name: '用户管理' })).toBeVisible()

  await page.goto('/#/examples/restricted')
  await expect(page).toHaveURL(/#\/403$/)
  await expect(page.getByRole('heading', { name: '无权限' })).toBeVisible()

  await page.goto('/#/missing-page')
  await expect(page).toHaveURL(/#\/404$/)
  await expect(page.getByRole('heading', { name: '页面不存在' })).toBeVisible()

  await page.getByRole('button', { name: '退出登录' }).click()
  await expect(page).toHaveURL(/#\/login/)
  await page.goto('/#/dashboard')
  await expect(page).toHaveURL(/#\/login\?redirect=\/dashboard$/)
})

test('admin 可以在动态菜单间导航', async ({ page }) => {
  await loginAsAdmin(page)
  await openTopMenu(page, '系统管理')
  await page.getByRole('menuitem', { name: '角色管理', exact: true }).click()
  await expect(page).toHaveURL(/#\/system\/role$/)
  await expect(page.getByRole('heading', { name: '角色管理' })).toBeVisible()
})
