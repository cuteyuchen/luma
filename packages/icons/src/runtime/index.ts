export {
  clearIconDataUriCache,
  getGradientIconDataUri,
  getIconDataUri,
  getIconSvgText,
} from './data-uri'
export { resolveAnyIconDefinition } from './resolver'
export {
  getStaticLocalSvgIconDefinitions,
  registerStaticLocalSvgIcons,
  resolveStaticLocalSvgIconDefinition,
} from './static-local'
export {
  applySvgGradient,
  composeSvgIcons,
  recolorSvgString,
  svgToDataUri,
  validateMonochromeSvg,
} from './svg'
export type { SvgValidationResult } from './svg'
