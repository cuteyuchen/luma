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
  getRegisteredIconDefinitions,
  registerIcons,
  resolveIconDefinition,
} from './registry/icons'
export {
  applySvgGradient,
  getGradientIconDataUri,
  getIconDataUri,
  getIconSvgText,
  getStaticLocalSvgIconDefinitions,
  recolorSvgString,
  registerStaticLocalSvgIcons,
  resolveAnyIconDefinition,
  resolveStaticLocalSvgIconDefinition,
  svgToDataUri,
} from './runtime'
export type {
  IconDefinition,
  IconGradientOptions,
  IconGradientStop,
  IconGroupDefinition,
  IconKey,
  IconSource,
} from './types'
