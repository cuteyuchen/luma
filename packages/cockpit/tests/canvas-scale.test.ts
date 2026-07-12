import { describe, expect, it } from 'vitest'
import { computeCanvasScale } from '../src/composables/useCanvasScale'

describe('computeCanvasScale', () => {
  it('按宽高较小比例等比缩放并居中', () => {
    // 容器 1920×540：高度受限，scale = 540/1080 = 0.5
    const result = computeCanvasScale(1920, 540, 1920, 1080)
    expect(result.scale).toBe(0.5)
    expect(result.scaledWidth).toBe(960)
    expect(result.scaledHeight).toBe(540)
    // 水平居中偏移
    expect(result.offsetX).toBe((1920 - 960) / 2)
    expect(result.offsetY).toBe(0)
  })

  it('容器等于基准时 scale 为 1', () => {
    const result = computeCanvasScale(1920, 1080, 1920, 1080)
    expect(result.scale).toBe(1)
    expect(result.offsetX).toBe(0)
    expect(result.offsetY).toBe(0)
  })

  it('非法尺寸回退到 scale 1', () => {
    expect(computeCanvasScale(0, 0, 1920, 1080).scale).toBe(1)
    expect(computeCanvasScale(1920, 1080, 0, 0).scale).toBe(1)
  })
})
