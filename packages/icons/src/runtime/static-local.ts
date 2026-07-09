import type { IconDefinition } from '../types'
import { registerIcons, resolveIconDefinition } from '../registry/icons'

const staticLocalIconDefinitions = new Map<string, IconDefinition>()

/***********************静态本地图标注册*********************/
export function registerStaticLocalSvgIcons(icons: IconDefinition[]): void {
  for (const icon of icons) {
    staticLocalIconDefinitions.set(icon.key, icon)
  }

  registerIcons(icons)
}

/***********************静态本地图标读取*********************/
export function getStaticLocalSvgIconDefinitions(): IconDefinition[] {
  return [...staticLocalIconDefinitions.values()]
}

export function resolveStaticLocalSvgIconDefinition(key: string): IconDefinition | undefined {
  return staticLocalIconDefinitions.get(key) ?? resolveIconDefinition(key)
}
