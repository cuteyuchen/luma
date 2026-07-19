import { describe, expect, it } from 'vitest'
import {
  applySvgGradient,
  clearIconDataUriCache,
  composeSvgIcons,
  getIconDataUri,
  recolorSvgString,
  registerIcons,
  svgToDataUri,
  validateMonochromeSvg,
} from '../src'

describe('@lumal/icons runtime', () => {
  const svgText = '<svg viewBox="0 0 16 16"><path fill="currentColor" d="M2 2h12v12H2z"/></svg>'

  it('可以把 SVG 文本转换成 data URI', () => {
    expect(svgToDataUri(svgText)).toContain('data:image/svg+xml')
  })

  it('可以在运行时替换 currentColor', () => {
    expect(recolorSvgString(svgText, '#1677ff')).toContain('#1677ff')
  })

  it('可以在运行时注入渐变定义', () => {
    const result = applySvgGradient(svgText, {
      id: 'lumal-gradient-test',
      from: '#1677ff',
      to: '#52c41a',
    })

    expect(result).toContain('linearGradient')
    expect(result).toContain('url(#lumal-gradient-test)')
  })

  it('可以通过已注册图标生成 data URI', () => {
    registerIcons([
      {
        key: 'app:data-uri',
        label: 'Data URI',
        source: 'local-svg',
        svgText,
      },
    ])

    expect(getIconDataUri('app:data-uri')).toContain('data:image/svg+xml')
    clearIconDataUriCache()
    expect(getIconDataUri('app:data-uri')).toContain('data:image/svg+xml')
  })

  it('可以拒绝脚本、外部资源和固定颜色', () => {
    expect(validateMonochromeSvg('<svg><script>alert(1)</script></svg>').valid).toBe(false)
    expect(validateMonochromeSvg('<svg><path fill="#fff" /></svg>')).toEqual({
      reason: '检测到固定颜色 #fff',
      valid: false,
    })
    expect(validateMonochromeSvg('<svg><path fill="currentColor" /></svg>').valid).toBe(true)
  })

  it('可以把多个单色 SVG 合成为分层图标', () => {
    const result = composeSvgIcons([
      svgText,
      '<svg viewBox="0 0 16 16"><circle fill="currentColor" cx="8" cy="8" r="2"/></svg>',
    ])

    expect(result).toContain('<svg viewBox="0 0 16 16">')
    expect(result).toContain('data-lumal-icon-layer="0"')
    expect(result).toContain('data-lumal-icon-layer="1"')
  })
})
