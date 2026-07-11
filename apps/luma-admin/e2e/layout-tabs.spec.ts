import { expect, test } from '@playwright/test'
import { loginAsAdmin, openTopMenu } from './helpers'

test('设置、标签页和移动布局可以完整操作并持久化', async ({ page }) => {
  await loginAsAdmin(page)
  await openTopMenu(page, '功能示例')
  await page.getByRole('menuitem', { name: 'Chart Panel', exact: true }).click()
  await expect(page.getByRole('tab', { name: 'Chart Panel' })).toBeVisible()

  await page.getByRole('tab', { name: 'Chart Panel' }).click({ button: 'right' })
  await expect(page.getByRole('menuitem', { name: '刷新当前页' })).toBeVisible()
  await page.getByRole('menuitem', { name: '刷新当前页' }).click()

  await page.getByRole('button', { name: '主题与布局设置' }).click()
  await page.getByRole('button', { name: '深色', exact: true }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)

  const layoutSection = page.locator('.luma-theme-settings__section').filter({ hasText: '布局模式' })
  await layoutSection.locator('.el-select').click()
  await page.getByRole('option', { name: '顶部导航' }).click()
  await page.reload()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await expect(page.getByRole('navigation', { name: '主导航' })).toBeVisible()

  await page.setViewportSize({ width: 375, height: 812 })
  await expect(page.getByRole('button', { name: /菜单|侧边栏/ })).toBeVisible()
  const overflow = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  expect(overflow.scrollWidth).toBe(overflow.clientWidth)
})
