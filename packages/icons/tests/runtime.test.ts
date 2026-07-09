import { describe, expect, it } from 'vitest'
import {
  applySvgGradient,
  getIconDataUri,
  recolorSvgString,
  registerIcons,
  svgToDataUri,
} from '../src'

describe('@luma/icons runtime', () => {
  const svgText = '<svg viewBox="0 0 16 16"><path fill="currentColor" d="M2 2h12v12H2z"/></svg>'

  it('可以把 SVG 文本转换成 data URI', () => {
    expect(svgToDataUri(svgText)).toContain('data:image/svg+xml')
  })

  it('可以在运行时替换 currentColor', () => {
    expect(recolorSvgString(svgText, '#1677ff')).toContain('#1677ff')
  })

  it('可以在运行时注入渐变定义', () => {
    const result = applySvgGradient(svgText, {
      id: 'luma-gradient-test',
      from: '#1677ff',
      to: '#52c41a',
    })

    expect(result).toContain('linearGradient')
    expect(result).toContain('url(#luma-gradient-test)')
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
  })
})
