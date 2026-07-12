import type { CockpitConfig } from '../types'
import { COCKPIT_SCHEMA_VERSION } from './defaults'

/***********************配置版本迁移*********************/

export type CockpitMigration = (config: Record<string, unknown>) => Record<string, unknown>

/**
 * 按 schemaVersion 顺序注册的迁移步骤。
 * 初版仅有 version 1，暂无迁移逻辑；后续版本升级时在此追加。
 * migrations[n] 负责把 version n 的配置升级到 version n+1。
 */
const migrations: Record<number, CockpitMigration> = {}

/**
 * 将任意历史版本的配置迁移到当前 schemaVersion。
 * 未知或缺失版本按 1 处理；迁移不会抛错，交由后续 normalize 兜底。
 */
export function migrateCockpitConfig(raw: unknown): Record<string, unknown> {
  const source = (typeof raw === 'object' && raw !== null ? { ...raw } : {}) as Record<string, unknown>

  let version = typeof source.schemaVersion === 'number' && Number.isFinite(source.schemaVersion)
    ? source.schemaVersion
    : 1

  let current = source
  while (version < COCKPIT_SCHEMA_VERSION) {
    const migrate = migrations[version]
    if (!migrate)
      break
    current = migrate(current)
    version += 1
  }

  current.schemaVersion = COCKPIT_SCHEMA_VERSION
  return current
}

/** 判断配置是否需要迁移 */
export function needsMigration(config: Pick<CockpitConfig, 'schemaVersion'>): boolean {
  return config.schemaVersion !== COCKPIT_SCHEMA_VERSION
}
