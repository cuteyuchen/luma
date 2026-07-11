import type { IconGradientOptions } from '../types'
import { resolveAnyIconDefinition } from './resolver'
import { applySvgGradient, recolorSvgString, svgToDataUri } from './svg'

const dataUriCache = new Map<string, string>()
const DATA_URI_CACHE_LIMIT = 256

function readThroughCache(key: string, factory: () => string): string {
  const cached = dataUriCache.get(key)
  if (cached !== undefined) {
    return cached
  }

  const value = factory()
  if (dataUriCache.size >= DATA_URI_CACHE_LIMIT) {
    dataUriCache.delete(dataUriCache.keys().next().value as string)
  }
  dataUriCache.set(key, value)
  return value
}

export function clearIconDataUriCache(): void {
  dataUriCache.clear()
}

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

  return readThroughCache(`${svgText}:${color ?? 'currentColor'}`, () => svgToDataUri(
    recolorSvgString(svgText, color),
  ))
}

export function getGradientIconDataUri(key: string, gradient: IconGradientOptions): string {
  const svgText = getIconSvgText(key)

  if (!svgText) {
    return ''
  }

  return readThroughCache(`${svgText}:${JSON.stringify(gradient)}`, () => svgToDataUri(
    applySvgGradient(svgText, gradient),
  ))
}
