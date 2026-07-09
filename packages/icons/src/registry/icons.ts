import type { IconDefinition, IconKey } from '../types'
import { iconDefinitions } from './state'

/***********************图标注册*********************/
export function registerIcons(icons: IconDefinition[]): void {
  for (const icon of icons) {
    iconDefinitions.set(icon.key, icon)
  }
}

/***********************图标读取*********************/
export function resolveIconDefinition(key: IconKey): IconDefinition | undefined {
  return iconDefinitions.get(key)
}

export function getRegisteredIconDefinitions(): IconDefinition[] {
  return [...iconDefinitions.values()]
}
