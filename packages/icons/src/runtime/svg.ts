import type { IconGradientOptions, IconGradientStop } from '../types'

const CURRENT_COLOR_PATTERN = /currentColor/g

/***********************SVG 编码*********************/
export function svgToDataUri(svgText: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`
}

/***********************SVG 改色*********************/
export function recolorSvgString(svgText: string, color = 'currentColor'): string {
  return svgText.replace(CURRENT_COLOR_PATTERN, color)
}

/***********************SVG 渐变*********************/
function resolveGradientStops(options: IconGradientOptions): IconGradientStop[] {
  if (options.stops?.length) {
    return options.stops
  }

  return [
    { offset: '0%', color: options.from ?? 'currentColor' },
    { offset: '100%', color: options.to ?? options.from ?? 'currentColor' },
  ]
}

function createGradientMarkup(options: Required<Pick<IconGradientOptions, 'id'>> & IconGradientOptions): string {
  const isVertical = options.direction === 'vertical'
  const stops = resolveGradientStops(options)
    .map((stop) => {
      const opacity = stop.opacity == null ? '' : ` stop-opacity="${stop.opacity}"`
      return `<stop offset="${stop.offset}" stop-color="${stop.color}"${opacity}/>`
    })
    .join('')

  return `<defs><linearGradient id="${options.id}" x1="0%" y1="0%" x2="${isVertical ? '0%' : '100%'}" y2="${isVertical ? '100%' : '0%'}">${stops}</linearGradient></defs>`
}

export function applySvgGradient(svgText: string, options: IconGradientOptions): string {
  const gradientId = options.id ?? 'luma-icon-gradient'
  const gradientMarkup = createGradientMarkup({ ...options, id: gradientId })
  const svgWithDefs = svgText.replace(/<svg([^>]*)>/, `<svg$1>${gradientMarkup}`)

  return svgWithDefs.replace(CURRENT_COLOR_PATTERN, `url(#${gradientId})`)
}
