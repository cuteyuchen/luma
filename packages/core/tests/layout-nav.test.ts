import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import {
  appendTab,
  closeAllTabs,
  closeOtherTabs,
  closeTab,
  closeTabsLeft,
  closeTabsRight,
  findMenuItemByPath,
  includesMenuPath,
  LumalTopNav,
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

  it('resolveNavigationTarget 会优先采用目录的显式重定向', () => {
    expect(resolveNavigationTarget({
      children: [
        { externalLink: 'https://example.com', path: '/resources/docs', title: '外链文档' },
        { path: '/resources/guide', title: '内嵌指南' },
      ],
      path: '/resources',
      redirect: '/resources/guide',
      title: '外部资源',
    })).toBe('/resources/guide')
  })

  it('会跳过隐藏菜单并支持递归查找外链项', () => {
    const extendedMenus = [
      {
        children: [
          { hidden: true, path: '/hidden', title: '隐藏页' },
          { externalLink: 'https://example.com', path: '/docs', title: '文档' },
        ],
        path: '/help',
        title: '帮助',
      },
    ]

    expect(resolveNavigationTarget(extendedMenus[0])).toBe('/docs')
    expect(findMenuItemByPath(extendedMenus, '/hidden')).toBeUndefined()
    expect(findMenuItemByPath(extendedMenus, '/docs')?.externalLink).toBe('https://example.com')
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

  it('批量关闭会保留固定标签和目标标签', () => {
    const tabs = [
      { closable: false, path: '/home', title: '首页' },
      { path: '/a', title: 'A' },
      { path: '/b', title: 'B' },
      { path: '/c', title: 'C' },
    ]

    expect(closeTabsLeft(tabs, '/b').map(tab => tab.path)).toEqual(['/home', '/b', '/c'])
    expect(closeTabsRight(tabs, '/b').map(tab => tab.path)).toEqual(['/home', '/a', '/b'])
    expect(closeOtherTabs(tabs, '/b').map(tab => tab.path)).toEqual(['/home', '/b'])
    expect(closeAllTabs(tabs).map(tab => tab.path)).toEqual(['/home'])
  })
})

describe('lumal top nav', () => {
  it('点击顶部菜单项会抛出 select 事件', async () => {
    const wrapper = mount(LumalTopNav, {
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

  it('支持递归菜单、隐藏项、对齐和最大宽度', () => {
    const wrapper = mount(LumalTopNav, {
      global: { stubs: elementPlusStubs },
      props: {
        align: 'center',
        maxWidth: 720,
        menus: [
          ...menus,
          { hidden: true, path: '/hidden', title: '隐藏页' },
        ],
      },
    })

    expect(wrapper.classes()).toContain('is-align-center')
    expect(wrapper.attributes('style')).toContain('--lumal-top-nav-max-width: 720px')
    expect(wrapper.text()).not.toContain('隐藏页')
    expect(wrapper.find('[data-menu-path="/dashboard/workplace"]').exists()).toBe(true)
  })

  it('flat 模式会为每个顶级菜单渲染独立节点', () => {
    const wrapper = mount(LumalTopNav, {
      global: { stubs: elementPlusStubs },
      props: {
        menus,
        mode: 'flat',
      },
    })

    expect(wrapper.findAll('.el-menu-item')).toHaveLength(2)
    expect(wrapper.text()).toContain('仪表盘')
    expect(wrapper.text()).toContain('关于')
  })

  it('一级叶子菜单在 activePath 命中后会标记 is-active', async () => {
    const wrapper = mount(LumalTopNav, {
      global: { stubs: elementPlusStubs },
      props: {
        activePath: '/dashboard/workplace',
        menus,
        mode: 'tree',
      },
    })

    expect(wrapper.find('[data-menu-path="/dashboard/workplace"]').classes()).toContain('is-active')

    await wrapper.setProps({ activePath: '/about' })

    expect(wrapper.find('[data-menu-path="/about"]').classes()).toContain('is-active')
    expect(wrapper.find('[data-menu-path="/dashboard/workplace"]').classes()).not.toContain('is-active')
  })

  it('flat 模式会按顶级路径标记选中项', async () => {
    const wrapper = mount(LumalTopNav, {
      global: { stubs: elementPlusStubs },
      props: {
        activePath: '/dashboard',
        menus,
        mode: 'flat',
      },
    })

    expect(wrapper.find('[data-menu-path="/dashboard"]').classes()).toContain('is-active')

    await wrapper.setProps({ activePath: '/about' })

    expect(wrapper.find('[data-menu-path="/about"]').classes()).toContain('is-active')
    expect(wrapper.find('[data-menu-path="/dashboard"]').classes()).not.toContain('is-active')
  })
})
