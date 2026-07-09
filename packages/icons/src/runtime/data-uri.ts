import type { IconGradientOptions } from '../types'
import { resolveAnyIconDefinition } from './resolver'
import { applySvgGradient, recolorSvgString, svgToDataUri } from './svg'

/***********************SVG 文本读取*********************/
export function getIconSvgText(key: string): string {
  const icon = resolveAnyIconDefinition(key)

  return icon?.svgText ?? ''
}

/***********************Data URI 生成*********************/
export function getIconDataUri(key: string, color?: string): string {
  const svgText = getIconSvgText(key)

  if (!svgText) {
    return ''
  }

  return svgToDataUri(recolorSvgString(svgText, color))
}

export function getGradientIconDataUri(key: string, gradient: IconGradientOptions): string {
  const svgText = getIconSvgText(key)

  if (!svgText) {
    return ''
  }

  return svgToDataUri(applySvgGradient(svgText, gradient))
}
