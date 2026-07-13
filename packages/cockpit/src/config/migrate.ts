import type { CockpitConfig } from '../types'
import { COCKPIT_SCHEMA_VERSION } from './defaults'

/***********************配置版本处理*********************/
// v3 为破坏性布局模型，不提供 v1/v2 自动迁移。

export type CockpitMigration = (config: Record<string, unknown>) => Record<string, unknown>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function migrateCockpitConfig(raw: unknown): Record<string, unknown> {
  if (!isRecord(raw))
    throw new Error('驾驶舱配置必须是对象。')
  if (raw.schemaVersion !== COCKPIT_SCHEMA_VERSION)
    throw new Error(`仅支持 v${COCKPIT_SCHEMA_VERSION} 驾驶舱配置，请重新创建布局。`)
  return { ...raw }
}

export function needsMigration(config: Pick<CockpitConfig, 'schemaVersion'>): boolean {
  return config.schemaVersion !== COCKPIT_SCHEMA_VERSION
}
