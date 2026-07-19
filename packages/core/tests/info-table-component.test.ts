import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { LumalInfoTable } from '../src/components/info-table'

describe('lumal info table', () => {
  it('会按语义字段渲染信息项并支持列数和标签宽度', () => {
    const wrapper = mount(LumalInfoTable, {
      props: {
        columns: 2,
        items: [
          { label: '框架名称', value: 'Lumal' },
          { label: '包名', value: '@lumal/core' },
        ],
        labelWidth: '96px',
      },
    })

    expect(wrapper.find('.lumal-info-table').attributes('style')).toContain('--lumal-info-table-columns: 2')
    expect(wrapper.find('.lumal-info-table__label').attributes('style')).toContain('width: 96px')
    expect(wrapper.text()).toContain('框架名称')
    expect(wrapper.text()).toContain('Lumal')
    expect(wrapper.text()).toContain('@lumal/core')
  })

  it('会过滤隐藏项并使用空值占位', () => {
    const wrapper = mount(LumalInfoTable, {
      props: {
        emptyText: '暂无',
        items: [
          { label: '可见项', value: '' },
          { hidden: true, label: '隐藏项', value: 'secret' },
        ],
      },
    })

    expect(wrapper.text()).toContain('可见项')
    expect(wrapper.text()).toContain('暂无')
    expect(wrapper.text()).not.toContain('隐藏项')
    expect(wrapper.text()).not.toContain('secret')
  })
})
