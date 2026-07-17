import type { IconDefinition, IconGroupDefinition, IconKey } from '../types'

/***********************注册表状态*********************/
export const iconDefinitions = new Map<IconKey, IconDefinition>()

export const iconGroups = new Map<string, IconGroupDefinition>()

export type IconRegistryListener = () => void

const registryListeners = new Set<IconRegistryListener>()

export function notifyIconRegistryChange(): void {
  for (const listener of registryListeners) {
    listener()
  }
}

export function subscribeIconRegistry(listener: IconRegistryListener): () => void {
  registryListeners.add(listener)

  return () => {
    registryListeners.delete(listener)
  }
}
