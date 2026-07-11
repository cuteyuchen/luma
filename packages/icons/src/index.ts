import LumaIcon from './components/LumaIcon.vue'
import LumaIconPicker from './components/LumaIconPicker.vue'
import LumaIconPickerDialog from './components/LumaIconPickerDialog.vue'

/***********************组件导出*********************/
export {
  LumaIcon,
  LumaIconPicker,
  LumaIconPickerDialog,
}

export {
  getRegisteredIconGroups,
  registerIconGroups,
} from './registry/groups'
/***********************图标能力导出*********************/
export {
  createComponentIconDefinitions,
  createIconifyIconDefinitions,
  getRegisteredIconDefinitions,
  registerIcons,
  resolveIconDefinition,
} from './registry/icons'
export {
  applySvgGradient,
  clearIconDataUriCache,
  composeSvgIcons,
  getGradientIconDataUri,
  getIconDataUri,
  getIconSvgText,
  getStaticLocalSvgIconDefinitions,
  recolorSvgString,
  registerStaticLocalSvgIcons,
  resolveAnyIconDefinition,
  resolveStaticLocalSvgIconDefinition,
  svgToDataUri,
  validateMonochromeSvg,
} from './runtime'
export type { SvgValidationResult } from './runtime'
export type {
  IconDefinition,
  IconGradientOptions,
  IconGradientStop,
  IconGroupDefinition,
  IconKey,
  IconSource,
} from './types'
