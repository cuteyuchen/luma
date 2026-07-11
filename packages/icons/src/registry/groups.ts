import type { IconGroupDefinition } from '../types'
import { iconGroups } from './state'

/***********************分组注册*********************/
export function registerIconGroups(groups: IconGroupDefinition[]): void {
  for (const group of groups) {
    iconGroups.set(group.key, group)
  }
}

/***********************分组读取*********************/
export function getRegisteredIconGroups(): IconGroupDefinition[] {
  return [...iconGroups.values()].sort((left, right) =>
    (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER)
    || left.label.localeCompare(right.label),
  )
}
