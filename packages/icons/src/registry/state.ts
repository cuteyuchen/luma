import type { IconDefinition, IconGroupDefinition, IconKey } from '../types'
import { shallowReactive } from 'vue'

/***********************注册表状态*********************/
export const iconDefinitions = shallowReactive(new Map<IconKey, IconDefinition>())

export const iconGroups = shallowReactive(new Map<string, IconGroupDefinition>())
