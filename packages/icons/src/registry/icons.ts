import type { Component } from 'vue'
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

export function createComponentIconDefinitions(
  group: string,
  icons: Record<string, Component>,
): IconDefinition[] {
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
