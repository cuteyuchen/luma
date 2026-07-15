import { expect, test } from './fixtures'
import { expectNoPageOverflow, loginAsAdmin, openTopMenu } from './helpers'

async function openUserManagement(page: Parameters<typeof loginAsAdmin>[0]): Promise<void> {
  await loginAsAdmin(page)
  await openTopMenu(page, '系统管理')
  await page.getByRole('menuitem', { name: '用户管理', exact: true }).click()
  await expect(page.getByRole('heading', { name: '机构导航' })).toBeVisible()
}

test('用户管理支持机构筛选、批量启停和批量追加角色', async ({ page }) => {
  await openUserManagement(page)

  await page.getByLabel('搜索机构名称或编码').fill('product-operation')
  const organization = page.getByRole('treeitem', { name: '产品运营中心（product-operation）' })
  await expect(organization).toBeVisible()
  await organization.click()

  await expect(page.getByRole('cell', { name: 'operator', exact: true })).toBeVisible()
  await expect(page.getByRole('cell', { name: 'content-operator', exact: true })).toBeVisible()
  await expect(page.getByRole('cell', { name: 'admin', exact: true })).toHaveCount(0)

  const operatorRow = page.getByRole('row').filter({ has: page.getByRole('cell', { name: 'operator', exact: true }) })
  await operatorRow.locator('.el-checkbox').click()
  await page.getByRole('button', { name: '批量操作（1）' }).click()
  await page.getByText('批量停用', { exact: true }).click()
  await page.getByRole('dialog', { name: '批量停用' }).getByRole('button', { name: '停用', exact: true }).click()
  await expect(page.getByText('已停用 1 个用户')).toBeVisible()
  await expect(operatorRow.getByText('停用', { exact: true })).toBeVisible()

  await operatorRow.locator('.el-checkbox').click()
  await page.getByRole('button', { name: '批量操作（1）' }).click()
  await page.getByText('批量分配角色', { exact: true }).click()
  const dialog = page.getByRole('dialog', { name: '批量分配角色（已选 1 人）' })
  await expect(dialog.getByText('追加角色', { exact: true })).toBeVisible()
  await dialog.locator('.el-form-item').filter({ hasText: '角色' }).locator('.el-select').click()
  await page.getByRole('option', { name: '访客', exact: true }).click()
  await page.keyboard.press('Escape')
  await dialog.getByRole('button', { name: '保存角色', exact: true }).click()

  await expect(page.getByText('已更新 1 个用户的角色')).toBeVisible()
  await expect(operatorRow).toContainText('运营人员、访客')
  await expect(page.getByRole('button', { name: '批量操作（0）' })).toBeDisabled()
})

test('用户管理在四档视口下无页面级横向溢出', async ({ page }) => {
  await openUserManagement(page)

  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ height: 900, width })
    await expect(page.getByRole('heading', { name: '机构导航' })).toBeVisible()
    await expectNoPageOverflow(page)
  }
})
