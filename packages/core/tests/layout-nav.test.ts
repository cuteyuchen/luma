import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import {
  appendTab,
  closeTab,
  includesMenuPath,
  LumaTopNav,
  resolveActiveTopMenuPath,
  resolveCachedTabPaths,
  resolveNavigationTarget,
  splitMenusByLayout,
} from '../src/layout'
import { elementPlusStubs } from './helpers/element-plus-stubs'

const menus = [
  {
    children: [
      { path: '/dashboard/analysis', title: '分析页' },
      { path: '/dashboard/workplace', title: '工作台' },
    ],
    path: '/dashboard',
    title: '仪表盘',
  },
  {
    path: '/about',
    title: '关于',
  },
]

describe('menu layout helpers', () => {
  it('includesMenuPath 会递归命中子级路径', () => {
    expect(includesMenuPath(menus[0]!, '/dashboard/workplace')).toBe(true)
    expect(includesMenuPath(menus[1]!, '/dashboard')).toBe(false)
  })

  it('resolveNavigationTarget 会下钻到首个可导航子项', () => {
    expect(resolveNavigationTarget(menus[0])).toBe('/dashboard/analysis')
    expect(resolveNavigationTarget(menus[1])).toBe('/about')
  })

  it('resolveActiveTopMenuPath 会解析命中的顶层菜单', () => {
    expect(resolveActiveTopMenuPath(menus, '/dashboard/workplace')).toBe('/dashboard')
    expect(resolveActiveTopMenuPath(menus, '/unknown')).toBe('')
  })

  it('splitMenusByLayout 会按布局模式拆分菜单', () => {
    expect(splitMenusByLayout({ layout: 'sidebar-nav', menus })).toEqual({
      sidebarMenus: menus,
      topMenus: [],
    })
    expect(splitMenusByLayout({ layout: 'top-nav', menus })).toEqual({
      sidebarMenus: [],
      topMenus: menus,
    })

    const mixed = splitMenusByLayout({
      activeTopMenuPath: '/dashboard',
      layout: 'mixed-nav',
      menus,
    })
    expect(mixed.topMenus).toEqual(menus)
    expect(mixed.sidebarMenus).toEqual(menus[0]!.children)
  })
})

describe('tab strategy helpers', () => {
  it('appendTab 不重复添加同路径标签', () => {
    const tabs = [{ path: '/a', title: 'A' }]
    expect(appendTab(tabs, { path: '/a', title: 'A' })).toHaveLength(1)
    expect(appendTab(tabs, { path: '/b', title: 'B' })).toHaveLength(2)
  })

  it('appendTab 超出上限时移除最早的可关闭标签，保留固定标签', () => {
    const tabs = [
      { closable: false, path: '/home', title: '首页' },
      { path: '/a', title: 'A' },
      { path: '/b', title: 'B' },
    ]

    const result = appendTab(tabs, { path: '/c', title: 'C' }, { maxCount: 3 })

    expect(result.map(tab => tab.path)).toEqual(['/home', '/b', '/c'])
  })

  it('closeTab 会移除可关闭标签但忽略固定标签', () => {
    const tabs = [
      { closable: false, path: '/home', title: '首页' },
      { path: '/a', title: 'A' },
    ]

    expect(closeTab(tabs, '/a').map(tab => tab.path)).toEqual(['/home'])
    expect(closeTab(tabs, '/home').map(tab => tab.path)).toEqual(['/home', '/a'])
  })

  it('resolveCachedTabPaths 在关闭缓存时返回空名单', () => {
    const tabs = [{ path: '/a', title: 'A' }, { path: '/b', title: 'B' }]

    expect(resolveCachedTabPaths(tabs)).toEqual(['/a', '/b'])
    expect(resolveCachedTabPaths(tabs, { enable: false })).toEqual([])
  })
})

describe('luma top nav', () => {
  it('点击顶部菜单项会抛出 select 事件', async () => {
    const wrapper = mount(LumaTopNav, {
      global: { stubs: elementPlusStubs },
      props: {
        activePath: '/about',
        menus,
      },
    })

    const items = wrapper.findAll('.el-menu-item')
    await items.at(-1)?.trigger('click')

    expect(wrapper.emitted('select')?.at(-1)).toEqual(['/about'])
  })
})
