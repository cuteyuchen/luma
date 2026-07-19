import type { Locator, Page } from '@playwright/test'
import { expect, test } from './fixtures'
import { expectNoPageOverflow, loginAsAdmin } from './helpers'

async function openMenuDialog(page: Page): Promise<Locator> {
  await page.getByRole('button', { name: '新增根节点', exact: true }).click()
  const dialog = page.locator('.lumal-menu-dialog')
  await expect(dialog).toBeVisible()
  return dialog
}

async function closeMenuDialog(dialog: Locator): Promise<void> {
  await dialog.locator('.el-dialog__headerbtn').click()
  await expect(dialog).toBeHidden()
}

test('菜单弹窗在桌面端保持宽度、栅格对齐并适配深浅主题', async ({ page }) => {
  await page.setViewportSize({ height: 900, width: 1440 })
  await loginAsAdmin(page)
  await page.goto('/#/system/menu')
  await expect(page.getByRole('heading', { name: '菜单管理', exact: true })).toBeVisible()

  let dialog = await openMenuDialog(page)
  const dialogBox = await dialog.boundingBox()
  expect(dialogBox).not.toBeNull()
  expect(dialogBox?.width).toBeGreaterThanOrEqual(950)
  expect(Math.abs((dialogBox?.x ?? 0) - (1440 - (dialogBox?.width ?? 0)) / 2)).toBeLessThan(2)

  const labelWidths = await dialog.locator('.el-form-item__label').evaluateAll(elements =>
    elements.map(element => Math.round(element.getBoundingClientRect().width)),
  )
  expect(labelWidths.length).toBeGreaterThan(5)
  expect(new Set(labelWidths)).toEqual(new Set([96]))

  const titleContent = await dialog.locator('[data-field="title"] .el-form-item__content').boundingBox()
  const nameContent = await dialog.locator('[data-field="name"] .el-form-item__content').boundingBox()
  const parentContent = await dialog.locator('[data-field="parentId"] .el-form-item__content').boundingBox()
  const pathContent = await dialog.locator('[data-field="path"] .el-form-item__content').boundingBox()
  expect(Math.abs((titleContent?.x ?? 0) - (nameContent?.x ?? 0))).toBeLessThan(2)
  expect(Math.abs((parentContent?.x ?? 0) - (pathContent?.x ?? 0))).toBeLessThan(2)
  expect(titleContent?.width ?? 0).toBeGreaterThan(300)

  const lightBackground = await dialog.evaluate(element => getComputedStyle(element).backgroundColor)
  expect(lightBackground).not.toBe('rgba(0, 0, 0, 0)')
  await closeMenuDialog(dialog)

  await page.getByRole('button', { name: '切换深色模式', exact: true }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
  dialog = await openMenuDialog(page)
  const darkBackground = await dialog.evaluate(element => getComputedStyle(element).backgroundColor)
  expect(darkBackground).not.toBe('rgba(0, 0, 0, 0)')
  expect(darkBackground).not.toBe(lightBackground)
  expect((await dialog.boundingBox())?.width ?? 0).toBeGreaterThanOrEqual(950)
  await expectNoPageOverflow(page)
})

test('菜单弹窗在 768px 和 375px 下单列显示且无横向溢出', async ({ page }) => {
  test.setTimeout(60_000)
  await loginAsAdmin(page)
  await page.goto('/#/system/menu')
  await expect(page.getByRole('heading', { name: '菜单管理', exact: true })).toBeVisible()

  for (const viewport of [
    { height: 900, width: 768 },
    { height: 812, width: 375 },
  ]) {
    await page.setViewportSize(viewport)
    const dialog = await openMenuDialog(page)
    const dialogBox = await dialog.boundingBox()
    expect(dialogBox).not.toBeNull()
    expect(dialogBox?.x ?? -1).toBeGreaterThanOrEqual(0)
    expect((dialogBox?.x ?? 0) + (dialogBox?.width ?? 0)).toBeLessThanOrEqual(viewport.width)

    const titleItem = await dialog.locator('[data-field="title"]').boundingBox()
    const parentItem = await dialog.locator('[data-field="parentId"]').boundingBox()
    expect(Math.abs((titleItem?.x ?? 0) - (parentItem?.x ?? 0))).toBeLessThan(2)
    expect(parentItem?.y ?? 0).toBeGreaterThan((titleItem?.y ?? 0) + (titleItem?.height ?? 0))

    const bodyOverflow = await dialog.locator('.el-dialog__body').evaluate(element => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }))
    expect(bodyOverflow.scrollWidth).toBe(bodyOverflow.clientWidth)
    await expectNoPageOverflow(page)
    await closeMenuDialog(dialog)
  }
})
