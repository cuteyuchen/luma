import type { IconDefinition } from '../types'
import { resolveIconDefinition } from '../registry/icons'
import { resolveStaticLocalSvgIconDefinition } from './static-local'

/***********************图标解析*********************/
export function resolveAnyIconDefinition(key: string): IconDefinition | undefined {
  return resolveIconDefinition(key) ?? resolveStaticLocalSvgIconDefinition(key)
}
