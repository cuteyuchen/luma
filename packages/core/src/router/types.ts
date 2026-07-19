import type { Component } from 'vue'

export type MenuNodeId = string

export type LumalRouteAuthority = string | string[]
export type LumalMenuBadgeType = 'dot' | 'text'
export type LumalMenuBadgeTone = 'primary' | 'success' | 'warning' | 'danger' | 'info'

export interface LumalRouteMeta {
  title?: string
  icon?: string
  order?: number
  hideInMenu?: boolean
  hideChildrenInMenu?: boolean
  activeMenu?: string
  keepAlive?: boolean
  affixTab?: boolean
  authority?: LumalRouteAuthority
  badge?: string | number
  badgeType?: LumalMenuBadgeType
  badgeTone?: LumalMenuBadgeTone
  hideInBreadcrumb?: boolean
  roles?: LumalRouteAuthority
  externalLink?: string
  externalTarget?: '_blank' | '_self'
  topMenu?: boolean
  [key: string]: unknown
}

export interface LumalMenuRecord {
  path: string
  children?: LumalMenuRecord[]
  component?: string
  meta?: LumalRouteMeta
  name?: string
  redirect?: string
  externalLink?: string
}

export type LumalMenuComponent = Component | (() => Promise<unknown>)
export type MenuRouteComponent = LumalMenuComponent

/**
 * 静态菜单可以直接绑定 Vue 组件或懒加载器；字符串组件仍交给 componentResolver 解析。
 */
export interface LumalStaticMenuRecord extends Omit<LumalMenuRecord, 'children' | 'component'> {
  children?: LumalStaticMenuRecord[]
  component?: string | LumalMenuComponent
}

/**
 * 非标准菜单记录：字段名由后端决定，需要通过 fieldNames 显式映射到标准字段。
 */
export type LumalMenuInputRecord = LumalMenuRecord | Record<string, unknown>

/**
 * 标准字段 -> 源字段名的映射，用于适配非标准后端菜单结构。
 * 未配置的字段回退到标准字段位置（顶层或 meta）。
 */
export interface MenuRecordFieldNames {
  activeMenu?: string
  badge?: string
  badgeType?: string
  badgeTone?: string
  path?: string
  name?: string
  component?: string
  redirect?: string
  children?: string
  title?: string
  icon?: string
  order?: string
  authority?: string
  roles?: string
  hideInMenu?: string
  hideInBreadcrumb?: string
  keepAlive?: string
  externalLink?: string
}

export interface NormalizeMenuRecordsOptions {
  fieldNames?: MenuRecordFieldNames
}

export interface MenuNode {
  activeMenu?: string
  badge?: string | number
  badgeType?: LumalMenuBadgeType
  badgeTone?: LumalMenuBadgeTone
  id: MenuNodeId
  path: string
  title: string
  children?: MenuNode[]
  component?: string | LumalMenuComponent
  icon?: string
  keepAlive?: boolean
  meta?: Record<string, unknown>
  name?: string
  order?: number
  parentId?: MenuNodeId
  permissions?: string[]
  redirect?: string
  roles?: string[]
  visible?: boolean
  hideInBreadcrumb?: boolean
  externalLink?: string
}

export interface NormalizedMenuNode extends Omit<MenuNode, 'children' | 'parentId'> {
  authority: string[]
  children: NormalizedMenuNode[]
  meta: Record<string, unknown>
  name: string
  permissions: string[]
  redirect?: string
  roles: string[]
  keepAlive?: boolean
  visible: boolean
  externalLink?: string
}

export type RouteComponentResolver = (component: string) => unknown

/**
 * glob 组件 resolver 选项：把标准 component 字符串解析为 import.meta.glob 收集到的组件模块。
 */
export interface GlobComponentResolverOptions {
  /** import.meta.glob 收集的模块表，key 为相对路径，value 为动态导入函数。 */
  modules: Record<string, () => Promise<unknown>>
  /** 视图目录前缀，默认 `../views`，与候选路径拼接。 */
  viewsPrefix?: string
  /** 未命中任何候选路径时的兜底组件。 */
  fallback?: () => Promise<unknown>
}

export interface CreateRouteRecordsOptions {
  componentResolver?: RouteComponentResolver
}

export interface LumalRouteRecord {
  path: string
  children?: LumalRouteRecord[]
  component?: unknown
  redirect?: string
  meta: {
    authority?: string[]
    permissions: string[]
    roles: string[]
    title: string
    externalLink?: string
    [key: string]: unknown
  }
  name: string
}

export interface SidebarMenuItem {
  badge?: string | number
  badgeType?: LumalMenuBadgeType
  badgeTone?: LumalMenuBadgeTone
  path: string
  redirect?: string
  title: string
  children: SidebarMenuItem[]
  icon?: string
  externalLink?: string
  externalTarget?: '_blank' | '_self'
}

export interface CreateSidebarMenusOptions {
  hasPermission?: (permissions: string[]) => boolean
  hasRole?: (roles: string[]) => boolean
}

/**
 * 顶部菜单生成选项：在侧边菜单可访问过滤的基础上，仅保留标记为顶部菜单（meta.topMenu）的一级项。
 */
export type CreateTopMenusOptions = CreateSidebarMenusOptions

export interface FindAccessibleMenuOptions {
  hasPermission?: (permissions: string[]) => boolean
  hasRole?: (roles: string[]) => boolean
}

/**
 * vue-router 的最小子集，避免在类型层强依赖 vue-router 具体版本。
 */
export interface RouteRegistryRouterLike {
  addRoute: (route: LumalRouteRecord) => (() => void) | unknown
  getRoutes?: () => readonly { name?: string | symbol, path: string }[]
  hasRoute: (name: string) => boolean
  removeRoute: (name: string) => void
}

/**
 * 菜单路由运行时需要读取现有路由路径，以便在注册前完成 path 冲突校验。
 * 旧 createRouteRegistry 继续接受不含 getRoutes 的宽松 Router 子集。
 */
export interface MenuRouteRuntimeRouterLike extends RouteRegistryRouterLike {
  getRoutes: () => readonly { name?: string | symbol, path: string }[]
}

/**
 * 动态路由注册器：负责注册后端下发的动态路由并支持整体重置。
 */
export interface RouteRegistry {
  register: (routes: LumalRouteRecord[]) => void
  reset: () => void
  readonly names: readonly string[]
}

export type MenuRouteSource = 'static' | 'remote'
export type MenuRouteConflictSource = MenuRouteSource | 'existing'
export type MenuRouteConflictKind = 'id' | 'name' | 'path'

export interface MenuRouteErrorContext {
  component?: string
  phase: 'load-component' | 'load-remote-menus' | 'register-routes' | 'resolve-component'
  routeName?: string
  routePath?: string
  source?: MenuRouteSource
}

export interface CreateMenuRouteRuntimeOptions {
  router: MenuRouteRuntimeRouterLike
  staticMenus?: LumalStaticMenuRecord[]
  loadRemoteMenus?: () => Promise<LumalMenuInputRecord[]>
  remoteNormalizeOptions?: NormalizeMenuRecordsOptions
  componentResolver?: RouteComponentResolver
  fallbackComponent?: () => Promise<unknown>
  hasPermission?: (permissions: string[]) => boolean
  hasRole?: (roles: string[]) => boolean
  onError?: (error: unknown, context: MenuRouteErrorContext) => void
}

export interface MenuRouteRuntime {
  readonly firstAccessibleMenu: NormalizedMenuNode | undefined
  readonly firstAccessiblePath: string
  readonly menus: NormalizedMenuNode[]
  readonly remoteLoaded: boolean
  readonly remoteMenus: NormalizedMenuNode[]
  readonly routeNames: readonly string[]
  readonly routes: LumalRouteRecord[]
  readonly sidebarMenus: SidebarMenuItem[]
  readonly staticMenus: NormalizedMenuNode[]
  readonly topMenus: SidebarMenuItem[]
  loadRemote: () => Promise<NormalizedMenuNode[]>
  reload: () => Promise<NormalizedMenuNode[]>
  resetRemote: () => void
  dispose: () => void
}
