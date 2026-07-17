import type { IconDefinition, IconKey } from '../types'
import { iconDefinitions, notifyIconRegistryChange } from './state'

/***********************图标注册*********************/
export function registerIcons(icons: IconDefinition[]): void {
  for (const icon of icons) {
    iconDefinitions.set(icon.key, icon)
  }

  if (icons.length) {
    notifyIconRegistryChange()
  }
}

/***********************图标读取*********************/
export function resolveIconDefinition(key: IconKey): IconDefinition | undefined {
  return iconDefinitions.get(key)
}

export function getRegisteredIconDefinitions(): IconDefinition[] {
  return [...iconDefinitions.values()]
}

export function createComponentIconDefinitions<TComponent>(
  group: string,
  icons: Record<string, TComponent>,
): IconDefinition<TComponent>[] {
  return Object.entries(icons).map(([key, component]) => ({
    component,
    group,
    key: `${group}:${key}`,
    label: key,
    source: 'component',
  }))
}

export function createIconifyIconDefinitions(group: string, icons: string[]): IconDefinition[] {
  return icons.map(icon => ({
    group,
    icon,
    key: `${group}:${icon}`,
    label: icon,
    source: 'iconify',
  }))
}
