import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { createCockpitRegistry } from '../src/registry/createCockpitRegistry'

const StubComp = defineComponent({ name: 'Stub', template: '<div />' })

describe('createCockpitRegistry', () => {
  it('注册并解析中央组件', () => {
    const registry = createCockpitRegistry()
    registry.registerCenter({ type: 'center-a', label: 'A', component: StubComp })
    expect(registry.resolveCenter('center-a')?.label).toBe('A')
    expect(registry.resolveCenter('missing')).toBeUndefined()
  })

  it('注册并解析业务模块', () => {
    const registry = createCockpitRegistry()
    registry.registerWidget({ type: 'widget-a', label: 'W', component: StubComp })
    expect(registry.resolveWidget('widget-a')?.label).toBe('W')
  })

  it('拒绝重复 type 并抛出可定位错误', () => {
    const registry = createCockpitRegistry()
    registry.registerCenter({ type: 'dup', label: 'A', component: StubComp })
    expect(() => registry.registerCenter({ type: 'dup', label: 'B', component: StubComp }))
      .toThrowError(/dup/)
  })

  it('拒绝空 type', () => {
    const registry = createCockpitRegistry()
    expect(() => registry.registerWidget({ type: '', label: 'X', component: StubComp })).toThrow()
    expect(() => registry.registerWidget({ type: '  ', label: 'X', component: StubComp })).toThrow()
  })

  it('中央组件与模块使用独立命名空间', () => {
    const registry = createCockpitRegistry()
    registry.registerCenter({ type: 'shared', label: 'C', component: StubComp })
    // 同名 type 在模块命名空间不冲突
    expect(() => registry.registerWidget({ type: 'shared', label: 'W', component: StubComp })).not.toThrow()
    expect(registry.resolveCenter('shared')?.label).toBe('C')
    expect(registry.resolveWidget('shared')?.label).toBe('W')
  })

  it('list 返回稳定插入顺序且不暴露内部可变数组', () => {
    const registry = createCockpitRegistry()
    registry.registerCenters([
      { type: 'c1', label: '1', component: StubComp },
      { type: 'c2', label: '2', component: StubComp },
    ])
    const list = registry.listCenters()
    expect(list.map(c => c.type)).toEqual(['c1', 'c2'])
    expect(Object.isFrozen(list)).toBe(true)
  })

  it('注销后无法解析', () => {
    const registry = createCockpitRegistry()
    registry.registerWidget({ type: 'w', label: 'W', component: StubComp })
    registry.unregisterWidget('w')
    expect(registry.resolveWidget('w')).toBeUndefined()
  })
})
