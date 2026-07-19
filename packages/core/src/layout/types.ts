import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { LumalTabStyle } from '../theme/types'

export type LumalMenuBadgeType = 'dot' | 'text'
export type LumalMenuBadgeTone = 'danger' | 'info' | 'primary' | 'success' | 'warning'

export interface LumalLayoutMenuItem {
  path: string
  redirect?: string
  title: string
  badge?: number | string
  badgeTone?: LumalMenuBadgeTone
  badgeType?: LumalMenuBadgeType
  children?: LumalLayoutMenuItem[]
  externalLink?: string
  externalTarget?: '_blank' | '_self'
  hidden?: boolean
  icon?: string
}

export interface LumalLayoutTabItem {
  path: string
  title: string
  closable?: boolean
  icon?: string
  /** 是否固定到左侧固定组；用户取消固定可置为 false，路由声明 closable=false 的页签禁止取消固定。 */
  pinned?: boolean
}

export type LumalLayoutRouteTabFilter = (route: RouteLocationNormalizedLoaded) => boolean

export type LumalLayoutRouteTabResolver = (
  route: RouteLocationNormalizedLoaded,
) => LumalLayoutTabItem | undefined

export type { LumalTabStyle }
