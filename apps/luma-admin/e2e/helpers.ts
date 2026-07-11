import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

export async function resetBrowserState(page: Page): Promise<void> {
  await page.goto('/#/login')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
}

export async function loginAsAdmin(page: Page): Promise<void> {
  await resetBrowserState(page)
  await page.getByTestId('login-submit').click()
  await expect(page).toHaveURL(/#\/dashboard$/)
  await expect(page.getByRole('heading', { name: /欢迎回来/ })).toBeVisible()
}

export async function openTopMenu(page: Page, name: string): Promise<void> {
  await page.getByRole('menuitem', { name, exact: true }).click()
}
