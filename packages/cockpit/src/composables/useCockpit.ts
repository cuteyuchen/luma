import type { ComputedRef, Ref } from 'vue'
import type {
  CockpitCategoryConfig,
  CockpitConfig,
  CockpitPageConfig,
} from '../types'
import { computed } from 'vue'

/***********************驾驶舱运行时编排*********************/

export interface UseCockpitOptions {
  /** 当前运行配置（响应式 getter） */
  config: () => CockpitConfig
  /** 受控的当前分类 id（v-model） */
  activeCategoryId: Ref<string | undefined>
  /** 受控的当前页面 id（v-model） */
  activePageId: Ref<string | undefined>
}

export interface UseCockpitReturn {
  visibleCategories: ComputedRef<CockpitCategoryConfig[]>
  activeCategory: ComputedRef<CockpitCategoryConfig | undefined>
  activePages: ComputedRef<CockpitPageConfig[]>
  activePage: ComputedRef<CockpitPageConfig | undefined>
  selectCategory: (id: string) => void
  selectPage: (id: string) => void
}

function sortByOrder<T extends { order?: number }>(items: T[]): T[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const orderA = a.item.order ?? a.index
      const orderB = b.item.order ?? b.index
      if (orderA === orderB)
        return a.index - b.index
      return orderA - orderB
    })
    .map(entry => entry.item)
}

/**
 * 解析当前分类与页面，处理受控值失效时的回退：
 * - 受控 id 有效则采用。
 * - 否则回退到配置声明的 activeId。
 * - 再否则回退到第一个可见项。
 */
export function useCockpit(options: UseCockpitOptions): UseCockpitReturn {
  const { config, activeCategoryId, activePageId } = options

  const visibleCategories = computed(() =>
    sortByOrder(config().categories.filter(category => category.visible !== false)),
  )

  const activeCategory = computed<CockpitCategoryConfig | undefined>(() => {
    const categories = visibleCategories.value
    if (categories.length === 0)
      return undefined
    const requested = activeCategoryId.value ?? config().activeCategoryId
    return categories.find(category => category.id === requested) ?? categories[0]
  })

  const activePages = computed(() => {
    const category = activeCategory.value
    if (!category)
      return []
    return sortByOrder(category.pages)
  })

  const activePage = computed<CockpitPageConfig | undefined>(() => {
    const pages = activePages.value
    if (pages.length === 0)
      return undefined
    const category = activeCategory.value
    const requested = activePageId.value ?? category?.activePageId
    return pages.find(page => page.id === requested) ?? pages[0]
  })

  function selectCategory(id: string): void {
    activeCategoryId.value = id
    // 切换分类后重置页面选择，交由回退逻辑选中该分类第一个页面
    activePageId.value = undefined
  }

  function selectPage(id: string): void {
    activePageId.value = id
  }

  return {
    visibleCategories,
    activeCategory,
    activePages,
    activePage,
    selectCategory,
    selectPage,
  }
}
