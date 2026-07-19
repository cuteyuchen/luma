import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { LumalChartPanel } from '../src'

describe('lumal chart panel', () => {
  it('loading 时展示加载状态，不渲染图表', () => {
    const wrapper = mount(LumalChartPanel, {
      global: {
        stubs: { LumalChart: true, VChart: true },
      },
      props: {
        loading: true,
        title: '访问趋势',
      },
    })

    expect(wrapper.text()).toContain('访问趋势')
    expect(wrapper.text()).toContain('加载中')
  })

  it('noData 时展示空状态文案', () => {
    const wrapper = mount(LumalChartPanel, {
      global: {
        stubs: { LumalChart: true, VChart: true },
      },
      props: {
        emptyText: '暂无数据',
        noData: true,
      },
    })

    expect(wrapper.text()).toContain('暂无数据')
  })

  it('支持查询区、表格视图和导出事件', async () => {
    const onExport = vi.fn()
    const wrapper = mount(LumalChartPanel, {
      global: {
        stubs: { LumalChart: true, VChart: true },
      },
      props: {
        options: {},
        showExport: true,
        showViewToggle: true,
        summary: '最近七天共 120 次访问',
        onExport,
      },
      slots: {
        query: '<label>统计周期</label>',
        table: '<table><tbody><tr><td>120</td></tr></tbody></table>',
      },
    })

    expect(wrapper.text()).toContain('统计周期')
    expect(wrapper.get('.lumal-chart-panel__summary').text()).toContain('120 次访问')
    await wrapper.findAll('.lumal-chart-panel__view-toggle button')[1]!.trigger('click')
    expect(wrapper.text()).toContain('120')
    await wrapper.get('.lumal-chart-panel__actions > button').trigger('click')
    expect(onExport).toHaveBeenCalledWith('table')
  })

  it('错误状态可以触发重试', async () => {
    const onRetry = vi.fn()
    const wrapper = mount(LumalChartPanel, {
      props: {
        error: new Error('服务暂不可用'),
        onRetry,
      },
    })

    expect(wrapper.get('[role="alert"]').text()).toContain('服务暂不可用')
    await wrapper.get('[role="alert"] button').trigger('click')
    expect(onRetry).toHaveBeenCalledOnce()
  })
})
