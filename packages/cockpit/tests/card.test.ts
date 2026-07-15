import type { CockpitCardTab } from '../src/runtime/card'
import type { CockpitWidgetInstance } from '../src/types'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import LumaCockpitCard from '../src/runtime/LumaCockpitCard.vue'

const widgets: CockpitWidgetInstance[] = [
  { id: 'widget-a', type: 'stub', title: '模块甲' },
  { id: 'widget-b', type: 'stub', title: '模块乙' },
  { id: 'widget-c', type: 'stub', title: '模块丙' },
]

const tabs: CockpitCardTab[] = widgets.map(widget => ({
  id: widget.id,
  title: widget.title!,
  widget,
}))

describe('luma cockpit card', () => {
  it('渲染单标题和内容，不创建 Tab 语义', () => {
    const wrapper = mount(LumaCockpitCard, {
      props: { title: '运行概览', widget: widgets[0] },
      slots: { default: () => h('div', { class: 'card-content' }, '模块内容') },
    })

    expect(wrapper.find('.luma-cockpit-card__title').text()).toBe('运行概览')
    expect(wrapper.find('[role="tab"]').exists()).toBe(false)
    expect(wrapper.find('[role="tabpanel"]').exists()).toBe(false)
    expect(wrapper.find('.card-content').text()).toBe('模块内容')
  })

  it('单个 Tab 退化为普通标题', () => {
    const wrapper = mount(LumaCockpitCard, {
      props: { tabs: [tabs[0]] },
      slots: {
        default: ({ activeTabId }: { activeTabId: string | undefined }) => h('div', { class: 'active-id' }, activeTabId),
      },
    })

    expect(wrapper.find('.luma-cockpit-card__title').text()).toBe('模块甲')
    expect(wrapper.find('[role="tablist"]').exists()).toBe(false)
    expect(wrapper.find('[role="tab"]').exists()).toBe(false)
    expect(wrapper.find('[role="tabpanel"]').exists()).toBe(false)
    expect(wrapper.find('.active-id').text()).toBe('widget-a')
  })

  it('按受控值选择 Tab，并建立完整的 Tab 与面板 ARIA 关联', () => {
    const wrapper = mount(LumaCockpitCard, {
      props: { tabs, activeTabId: 'widget-b' },
      slots: {
        default: ({ activeTabId }: { activeTabId: string | undefined }) => h('div', { class: 'active-id' }, activeTabId),
      },
    })

    const tabButtons = wrapper.findAll('[role="tab"]')
    const panel = wrapper.get('[role="tabpanel"]')
    expect(tabButtons).toHaveLength(3)
    expect(tabButtons.map(tab => tab.attributes('aria-selected'))).toEqual(['false', 'true', 'false'])
    expect(tabButtons.map(tab => tab.attributes('tabindex'))).toEqual(['-1', '0', '-1'])
    expect(tabButtons.every(tab => tab.attributes('aria-controls') === panel.attributes('id'))).toBe(true)
    expect(panel.attributes('aria-labelledby')).toBe(tabButtons[1].attributes('id'))
    expect(wrapper.find('.active-id').text()).toBe('widget-b')
  })

  it('非法受控值回退到首个 Tab 并请求同步受控状态', () => {
    const wrapper = mount(LumaCockpitCard, {
      props: { tabs, activeTabId: 'missing-widget' },
    })

    const tabButtons = wrapper.findAll('[role="tab"]')
    expect(tabButtons.map(tab => tab.attributes('aria-selected'))).toEqual(['true', 'false', 'false'])
    expect(wrapper.get('[role="tabpanel"]').attributes('aria-labelledby')).toBe(tabButtons[0].attributes('id'))
    expect(wrapper.emitted('update:activeTabId')).toEqual([['widget-a']])
  })

  it('点击 Tab 发出更新，并在受控值更新后切换面板关联', async () => {
    const wrapper = mount(LumaCockpitCard, {
      props: { tabs, activeTabId: 'widget-a' },
    })

    const tabButtons = wrapper.findAll('[role="tab"]')
    await tabButtons[1].trigger('click')
    expect(wrapper.emitted('update:activeTabId')).toEqual([['widget-b']])

    await wrapper.setProps({ activeTabId: 'widget-b' })
    expect(tabButtons[1].attributes('aria-selected')).toBe('true')
    expect(wrapper.get('[role="tabpanel"]').attributes('aria-labelledby')).toBe(tabButtons[1].attributes('id'))
  })

  it('支持方向键、Home 和 End 切换并移动焦点', async () => {
    const wrapper = mount(LumaCockpitCard, {
      attachTo: document.body,
      props: { tabs, activeTabId: 'widget-b' },
    })
    const tabButtons = wrapper.findAll<HTMLButtonElement>('[role="tab"]')

    tabButtons[1].element.focus()
    await tabButtons[1].trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(document.activeElement).toBe(tabButtons[2].element)

    await wrapper.setProps({ activeTabId: 'widget-c' })
    await tabButtons[2].trigger('keydown', { key: 'Home' })
    await nextTick()
    expect(document.activeElement).toBe(tabButtons[0].element)

    await wrapper.setProps({ activeTabId: 'widget-a' })
    await tabButtons[0].trigger('keydown', { key: 'End' })
    await nextTick()
    expect(document.activeElement).toBe(tabButtons[2].element)

    await wrapper.setProps({ activeTabId: 'widget-c' })
    await tabButtons[2].trigger('keydown', { key: 'ArrowLeft' })
    await nextTick()
    expect(document.activeElement).toBe(tabButtons[1].element)
    expect(wrapper.emitted('update:activeTabId')).toEqual([
      ['widget-c'],
      ['widget-a'],
      ['widget-c'],
      ['widget-b'],
    ])

    wrapper.unmount()
  })

  it('tab 重排后仍按稳定 id 移动焦点', async () => {
    const wrapper = mount(LumaCockpitCard, {
      attachTo: document.body,
      props: { tabs, activeTabId: 'widget-b' },
    })
    const reorderedTabs = [tabs[2], tabs[1], tabs[0]]

    await wrapper.setProps({ tabs: reorderedTabs })
    const tabButtons = wrapper.findAll<HTMLButtonElement>('[role="tab"]')
    tabButtons[1].element.focus()
    await tabButtons[1].trigger('keydown', { key: 'ArrowRight' })
    await nextTick()

    expect(wrapper.emitted('update:activeTabId')).toEqual([['widget-a']])
    expect(document.activeElement).toBe(tabButtons[2].element)
    wrapper.unmount()
  })
})
