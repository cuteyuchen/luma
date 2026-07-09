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
  return [...iconGroups.values()]
}
