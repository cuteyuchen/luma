import type { CockpitConfig } from '../types'
import { migrateCockpitConfig } from './migrate'
import { normalizeCockpitConfig } from './normalize'

export {
  COCKPIT_SCHEMA_VERSION,
  createCockpitId,
  createDefaultCockpitConfig,
  createGridCell,
  createGridColumn,
  createGridRow,
  createLayout,
  createRegion,
  createWidgetInstance,
  DEFAULT_COLUMN_WIDTH,
  DEFAULT_ROW_HEIGHT,
} from './defaults'
export {
  migrateCockpitConfig,
  needsMigration,
} from './migrate'
export type { CockpitMigration } from './migrate'
export { normalizeCockpitConfig } from './normalize'
export { validateCockpitConfig } from './validate'
export type { CockpitValidationResult } from './validate'

/**
 * 加载配置的标准管线：先迁移到当前 schema 版本，再标准化为安全可渲染配置。
 * 运行时加载与 Designer 打开草稿都应经过此函数。
 */
export function prepareCockpitConfig(raw: unknown): CockpitConfig {
  return normalizeCockpitConfig(migrateCockpitConfig(raw))
}
