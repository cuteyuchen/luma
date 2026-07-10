import type { LumaLayoutTabItem } from '../types'

/***********************标签页策略*********************/
export interface AppendTabOptions {
  /** 最大标签数，0 表示不限制。 */
  maxCount?: number
}

/**
 * 追加标签页并按策略裁剪：
 * - 已存在同路径则不重复添加；
 * - 超过 maxCount 时，从最早的可关闭标签开始移除（保留不可关闭的固定标签）。
 */
export function appendTab(
  tabs: LumaLayoutTabItem[],
  tab: LumaLayoutTabItem,
  options: AppendTabOptions = {},
): LumaLayoutTabItem[] {
  const exists = tabs.some(item => item.path === tab.path)
  const nextTabs = exists ? [...tabs] : [...tabs, tab]
  const maxCount = options.maxCount ?? 0

  if (maxCount <= 0 || nextTabs.length <= maxCount) {
    return nextTabs
  }

  const result = [...nextTabs]

  while (result.length > maxCount) {
    const removableIndex = result.findIndex(item => item.closable !== false && item.path !== tab.path)

    if (removableIndex === -1) {
      break
    }

    result.splice(removableIndex, 1)
  }

  return result
}

/**
 * 关闭指定标签，返回新标签列表；不可关闭的固定标签会被忽略。
 */
export function closeTab(tabs: LumaLayoutTabItem[], path: string): LumaLayoutTabItem[] {
  return tabs.filter(item => !(item.path === path && item.closable !== false))
}

/**
 * 计算标签缓存的组件 keepAlive 名单：仅当开启缓存时返回需要缓存的路径集合。
 */
export function resolveCachedTabPaths(
  tabs: LumaLayoutTabItem[],
  options: { enable?: boolean } = {},
): string[] {
  if (options.enable === false) {
    return []
  }

  return tabs.map(tab => tab.path)
}
