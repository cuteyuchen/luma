import { expect, test } from '@playwright/test'

const themes = ['dark', 'light'] as const
const viewports = [
  { height: 1080, label: '1920x1080', width: 1920 },
  { height: 768, label: '1366x768', width: 1366 },
] as const

test('DataV 特征动效与复杂装饰结构已接入', async ({ page }) => {
  await page.goto('/')

  expect(await page.locator('.luma-decoration[data-variant="1"] .luma-decoration__mark').count()).toBeGreaterThan(0)
  await expect(page.locator('.luma-decoration[data-variant="9"] .luma-decoration__ring')).toHaveCount(4)
  await expect(page.locator('.luma-decoration[data-variant="10"] .luma-decoration__segment')).toHaveCount(3)

  const borderOne = page.locator('.luma-border-box[data-variant="1"]')
  const borderEight = page.locator('.luma-border-box[data-variant="8"]')

  await expect(borderOne.locator('animate')).toHaveCount(12)
  await expect(borderEight.locator('animateMotion')).toHaveCount(1)
  await expect(borderEight.locator('use animate[attributeName="stroke-dasharray"]')).toHaveCount(1)
  await expect(page.locator('.luma-decoration[data-variant="12"] animateTransform')).toHaveCount(1)

  const borderEightSvg = borderEight.locator('svg')
  const startTime = await borderEightSvg.evaluate(element => (element as SVGSVGElement).getCurrentTime())
  await page.waitForTimeout(150)
  const runningTime = await borderEightSvg.evaluate(element => (element as SVGSVGElement).getCurrentTime())
  expect(runningTime).toBeGreaterThan(startTime + 0.05)

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(borderEight).toHaveClass(/is-animation-paused/)
  const pausedTime = await borderEightSvg.evaluate(element => (element as SVGSVGElement).getCurrentTime())
  await page.waitForTimeout(150)
  const stillPausedTime = await borderEightSvg.evaluate(element => (element as SVGSVGElement).getCurrentTime())
  expect(Math.abs(stillPausedTime - pausedTime)).toBeLessThan(0.03)
})

test('飞线图在固定 SMIL 时间保持 DataV 2.10.0 视觉', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/fidelity.html')

  const flyline = page.locator('[data-component="flylineChart"]')
  const enhanced = page.locator('[data-component="flylineChartEnhanced"]')
  await expect(flyline.locator('svg')).toBeVisible()
  await expect(enhanced.locator('svg')).toBeVisible()

  for (const chart of [flyline, enhanced]) {
    const path = chart.locator('path[data-flyline-path]').first()
    const dashAnimation = chart.locator('animate[attributeName="stroke-dasharray"]').first()
    await expect(dashAnimation).toBeAttached()
    const [length, from] = await Promise.all([
      path.evaluate(element => (element as SVGPathElement).getTotalLength()),
      dashAnimation.getAttribute('from'),
    ])
    expect(Number(from?.split(',')[1])).toBeCloseTo(length, 5)
  }

  await page.locator('.luma-flyline-chart svg, .luma-flyline-chart-enhanced svg').evaluateAll((svgs) => {
    svgs.forEach((svg) => {
      const animated = svg as SVGSVGElement
      animated.pauseAnimations()
      animated.setCurrentTime(1)
    })
  })

  await expect(flyline).toHaveScreenshot('flyline-chart-upstream-t1.png', {
    animations: 'allow',
    maxDiffPixels: 12,
  })
  await expect(enhanced).toHaveScreenshot('flyline-chart-enhanced-upstream-t1.png', {
    animations: 'allow',
    maxDiffPixels: 12,
  })
})

for (const theme of themes) {
  for (const viewport of viewports) {
    test(`${theme} ${viewport.label}`, async ({ page }) => {
      await page.setViewportSize({ height: viewport.height, width: viewport.width })
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto('/')

      const gallery = page.locator('main.gallery')
      await expect(page.locator('.luma-border-box')).toHaveCount(13)
      await expect(page.locator('.luma-decoration')).toHaveCount(12)

      if (theme === 'light') {
        await page.getByRole('button', { name: '切换浅色' }).click()
        await expect(gallery).toHaveClass(/is-light/)
      }

      const screenshot = await page.screenshot({
        animations: 'disabled',
        fullPage: true,
        mask: [1, 3, 6, 9].map(variant => page.locator(`.luma-decoration[data-variant="${variant}"]`)),
        maskColor: '#081322',
      })
      expect(screenshot).toMatchSnapshot(`datav-${theme}-${viewport.label}.png`, {
        // ECharts Canvas 文本与扇区边缘在不同帧存在少量
        // 抗锯齿抖动；几何忠实度由逐组件对照测试单独严格验证。
        maxDiffPixels: 2500,
      })
    })
  }
}
