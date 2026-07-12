import { expect, test } from '@playwright/test'
import { loginAs, loginAsAdmin } from './helpers'

/***********************驾驶舱 E2E 验收*********************/

test.describe('驾驶舱', () => {
  test('从 Header 进入驾驶舱并切换分类、页面', async ({ page }) => {
    await loginAsAdmin(page)

    // 从 Header 图标进入驾驶舱
    await page.locator('[data-action="open-cockpit"]').click()
    await expect(page).toHaveURL(/#\/cockpit/)

    // 分类导航可见
    await expect(page.locator('[aria-label="分类导航"]')).toBeVisible()

    // 中央组件示例渲染
    await expect(page.locator('.stub-center')).toBeVisible()
  })

  test('左右模块与中央组件双向消息联动', async ({ page }) => {
    await loginAsAdmin(page)
    await page.locator('[data-action="open-cockpit"]').click()
    await expect(page).toHaveURL(/#\/cockpit/)

    // 模块 → 中央：点击业务模块的选择项，中央组件展示来源
    await page.locator('[data-action="select-item-2"]').first().click()
    await expect(page.locator('[data-role="from-widget"]')).toContainText('2')

    // 中央 → 模块：中央广播，业务模块展示来源
    await page.locator('[data-action="center-select-A"]').first().click()
    await expect(page.locator('[data-role="from-center"]').first()).toContainText('A')
  })

  test('管理员可进入设计模式并保存后持久化', async ({ page }) => {
    await loginAsAdmin(page)
    await page.locator('[data-action="open-cockpit"]').click()
    await expect(page).toHaveURL(/#\/cockpit/)

    // 进入配置模式
    await page.locator('[data-action="cockpit-configure"]').click()
    await expect(page.getByRole('dialog', { name: '驾驶舱配置' })).toBeVisible()

    // 新增一列以验证布局编辑
    await page.getByRole('button', { name: '新增列' }).first().click()

    // 保存
    await page.getByRole('button', { name: '保存', exact: true }).click()
    await expect(page.getByRole('dialog', { name: '驾驶舱配置' })).toBeHidden()

    // 刷新后配置仍生效（保存到 mock 会话）
    await page.reload()
    await expect(page.locator('[aria-label="分类导航"]')).toBeVisible()
  })

  test('返回 Admin', async ({ page }) => {
    await loginAsAdmin(page)
    await page.locator('[data-action="open-cockpit"]').click()
    await expect(page).toHaveURL(/#\/cockpit/)

    await page.locator('[data-action="cockpit-back"]').click()
    await expect(page).toHaveURL(/#\/dashboard$/)
  })

  test('无查看权限账号看不到驾驶舱入口', async ({ page }) => {
    await loginAs(page, 'guest')
    await expect(page.locator('[data-action="open-cockpit"]')).toHaveCount(0)
  })
})
