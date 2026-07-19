import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import {
  LumaDigitalFlop,
  LumaLoading,
  LumaPercentPond,
  LumaWaterLevelPond,
} from '../src'

class ResizeObserverMock {
  static instances: ResizeObserverMock[] = []

  disconnect = vi.fn()
  observe = vi.fn()

  constructor(public callback: ResizeObserverCallback) {
    ResizeObserverMock.instances.push(this)
  }
}

class IntersectionObserverMock {
  static instances: IntersectionObserverMock[] = []

  disconnect = vi.fn()
  observe = vi.fn()

  constructor(public callback: IntersectionObserverCallback) {
    IntersectionObserverMock.instances.push(this)
  }

  emit(isIntersecting: boolean): void {
    this.callback([{ isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver)
  }
}

let frames: Map<number, FrameRequestCallback>
let nextFrame: number

async function flushFrames(): Promise<void> {
  const callbacks = [...frames.values()]
  frames.clear()
  callbacks.forEach(callback => callback(0))
  await nextTick()
}

beforeEach(() => {
  ResizeObserverMock.instances = []
  IntersectionObserverMock.instances = []
  frames = new Map()
  nextFrame = 0

  vi.stubGlobal('ResizeObserver', ResizeObserverMock)
  vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
  vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => {
    nextFrame += 1
    frames.set(nextFrame, callback)
    return nextFrame
  }))
  vi.stubGlobal('cancelAnimationFrame', vi.fn((id: number) => frames.delete(id)))
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function () {
    if (this.classList.contains('luma-percent-pond'))
      return 200
    if (this.classList.contains('luma-water-level-pond'))
      return 120
    return 100
  })
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(function () {
    if (this.classList.contains('luma-percent-pond'))
      return 100
    if (this.classList.contains('luma-water-level-pond'))
      return 120
    return 50
  })
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn().mockReturnValue({
      addEventListener: vi.fn(),
      matches: false,
      removeEventListener: vi.fn(),
    }),
  })
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('dataV core component fidelity', () => {
  it('loading 保留上游双圆半径、虚线长度、反向旋转和变色节奏', () => {
    const wrapper = mount(LumaLoading, { slots: { default: '加载中' } })
    const circles = wrapper.findAll('circle')
    const rotations = wrapper.findAll('animateTransform')
    const colors = wrapper.findAll('animate')

    expect(circles).toHaveLength(2)
    expect(circles[0]!.attributes()).toMatchObject({
      'cx': '25',
      'cy': '25',
      'r': '20',
      'stroke': '#02bcfe',
      'stroke-dasharray': '31.415, 31.415',
      'stroke-width': '3',
    })
    expect(circles[1]!.attributes()).toMatchObject({
      'r': '10',
      'stroke': '#3be6cb',
      'stroke-dasharray': '15.7, 15.7',
    })
    expect(rotations[0]!.attributes()).toMatchObject({ dur: '1.5s', values: '0, 25 25;360, 25 25' })
    expect(rotations[1]!.attributes()).toMatchObject({ dur: '1.5s', values: '360, 25 25;0, 25 25' })
    expect(colors[0]!.attributes()).toMatchObject({ dur: '3s', values: '#02bcfe;#3be6cb;#02bcfe' })
    expect(wrapper.text()).toBe('加载中')
  })

  it('digital flop 使用上游 Arial 30px、绿色填充和居中基线', () => {
    const wrapper = mount(LumaDigitalFlop, {
      props: { duration: 0, prefix: '¥', suffix: '万', value: 12.34, precision: 1 },
    })
    const text = wrapper.get('text')

    expect(text.attributes()).toMatchObject({
      'dominant-baseline': 'middle',
      'fill': '#3de7c9',
      'font-family': 'Arial',
      'font-size': '30',
      'font-weight': 'normal',
      'text-anchor': 'middle',
      'x': '50%',
      'y': '50%',
    })
    expect(text.text()).toBe('¥12.3万')
  })

  it('digital flop 支持上游 numberText 的多 number、多个 {nt} 和 rowGap', () => {
    const wrapper = mount(LumaDigitalFlop, {
      props: {
        content: '{nt}个\n同比{nt}%',
        duration: 0,
        numbers: [12.4, 8.6],
        precision: 1,
        rowGap: 6,
        textAlign: 'left',
      },
    })
    const lines = wrapper.findAll('tspan')

    expect(lines).toHaveLength(2)
    expect(lines[0]!.text()).toBe('12.4个')
    expect(lines[0]!.attributes()).toMatchObject({ dy: '-18', x: '0%' })
    expect(lines[1]!.text()).toBe('同比8.6%')
    expect(lines[1]!.attributes('dy')).toBe('36')
    expect(wrapper.get('text').attributes('text-anchor')).toBe('start')
  })

  it('digital flop 接受原生 config，并让显式 props 覆盖 config', async () => {
    const wrapper = mount(LumaDigitalFlop, {
      props: {
        color: '#abcdef',
        config: {
          animationFrame: 0,
          content: '{nt}个{nt}',
          formatter: value => `[${value}]`,
          number: [12.34, 8.61],
          style: { fill: '#ff0000', fontFamily: 'serif', fontSize: 24 },
          textAlign: 'right',
          toFixed: 1,
        },
      },
    })

    expect(wrapper.get('text').text()).toBe('[12.3]个[8.6]')
    expect(wrapper.get('text').attributes()).toMatchObject({
      'fill': '#abcdef',
      'font-family': 'serif',
      'font-size': '24',
      'text-anchor': 'end',
      'x': '100%',
    })

    await wrapper.setProps({
      config: { animationFrame: 0, content: '{nt}', number: [99], toFixed: 0 },
    })
    expect(wrapper.get('text').text()).toBe('99')
  })

  it('digital flop 映射上游描边、虚线和阴影样式', () => {
    const wrapper = mount(LumaDigitalFlop, {
      props: {
        config: {
          animationFrame: 0,
          content: '{nt}',
          number: [42],
          style: {
            lineCap: 'round',
            lineDash: [3, 2],
            lineDashOffset: 1,
            lineJoin: 'bevel',
            lineWidth: 2,
            shadowBlur: 6,
            shadowColor: '#123456',
            shadowOffsetX: 4,
            shadowOffsetY: 5,
            stroke: '#ffffff',
          },
        },
      },
    })

    expect(wrapper.get('text').attributes()).toMatchObject({
      'stroke': '#ffffff',
      'stroke-dasharray': '3,2',
      'stroke-dashoffset': '1',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'bevel',
      'stroke-width': '2',
    })
    expect(wrapper.get('feDropShadow').attributes()).toMatchObject({
      'dx': '4',
      'dy': '5',
      'flood-color': '#123456',
      'stdDeviation': '3',
    })
  })

  it('percent pond 按上游尺寸公式绘制渐变边框、虚线进度和居中文字', async () => {
    const wrapper = mount(LumaPercentPond, { props: { value: 25 } })
    await flushFrames()

    expect(wrapper.get('.luma-percent-pond__border').attributes()).toMatchObject({
      height: '97',
      rx: '5',
      width: '197',
      x: '1.5',
      y: '1.5',
    })
    expect(wrapper.get('.luma-percent-pond__progress').attributes()).toMatchObject({
      'points': '6,50 53,50.001',
      'stroke-dasharray': '5,1',
      'stroke-width': '88',
    })
    expect(wrapper.findAll('linearGradient')[1]!.attributes('x2')).toBe('175%')
    expect(wrapper.get('.luma-percent-pond__label').attributes()).toMatchObject({ x: '100', y: '50' })
    expect(wrapper.get('.luma-percent-pond__label').text()).toBe('25%')
  })

  it('percent pond 接受原生 config，且显式 value 覆盖 config.value', async () => {
    const wrapper = mount(LumaPercentPond, {
      props: {
        config: {
          borderGap: 2,
          borderRadius: 8,
          borderWidth: 4,
          colors: ['#112233', '#445566'],
          formatter: '完成 {value}',
          lineDash: [2, 3],
          localGradient: true,
          textColor: '#fefefe',
          value: 90,
        },
        value: 25,
      },
    })
    await flushFrames()

    const border = wrapper.get('.luma-percent-pond__border')
    const progress = wrapper.get('.luma-percent-pond__progress')
    expect(border.attributes()).toMatchObject({ 'rx': '8', 'stroke-width': '4', 'x': '2', 'y': '2' })
    expect(progress.attributes()).toMatchObject({
      'points': '6,50 53,50.001',
      'stroke-dasharray': '2,3',
      'stroke-width': '88',
    })
    expect(progress.attributes('stroke')).toBe(border.attributes('stroke'))
    expect(wrapper.find('clipPath').exists()).toBe(false)
    expect(progress.element.parentElement?.tagName.toLowerCase()).toBe('svg')
    expect(wrapper.get('.luma-percent-pond__label').attributes('fill')).toBe('#fefefe')
    expect(wrapper.get('.luma-percent-pond__label').text()).toBe('完成 25')
  })

  it('water level pond 使用 SVG smoothline 路径、画布内缩和边框几何', async () => {
    const wrapper = mount(LumaWaterLevelPond, { props: { value: 50 } })
    await flushFrames()

    const paths = (wrapper.vm as unknown as { getWavePaths: () => string[] }).getWavePaths()
    expect(paths).toHaveLength(1)
    expect(paths[0]).toMatch(/^M 146\.66666666666666 60 C /)
    expect(wrapper.get('.luma-water-level-pond__border').attributes()).toMatchObject({
      height: '116',
      width: '116',
      x: '2',
      y: '2',
    })
    expect(wrapper.get('text').attributes()).toMatchObject({ x: '60', y: '60' })
    expect(wrapper.get('text').text()).toBe('50%')
  })

  it('water level pond 按上游 config.data 为每个水位创建独立 smoothline', async () => {
    const wrapper = mount(LumaWaterLevelPond, {
      props: {
        config: {
          data: [20, 75],
          formatter: '峰值 {value}%',
          shape: 'round',
          waveHeight: 40,
          waveNum: 5,
          waveOpacity: 0.4,
        },
      },
    })
    await flushFrames()

    const paths = (wrapper.vm as unknown as { getWavePaths: () => string[] }).getWavePaths()
    expect(paths).toHaveLength(2)
    expect(paths[0]).toMatch(/^M 132\.8 91\.2 /)
    expect(paths[1]).toMatch(/^M 132\.8 34 /)
    expect(wrapper.get('text').text()).toBe('峰值 75%')
    expect(wrapper.find('ellipse').exists()).toBe(true)
  })

  it('loading 与 water pond 在离开视口时暂停 SMIL 并在卸载时断开观察器', async () => {
    const originalPause = Object.getOwnPropertyDescriptor(SVGSVGElement.prototype, 'pauseAnimations')
    const originalUnpause = Object.getOwnPropertyDescriptor(SVGSVGElement.prototype, 'unpauseAnimations')
    const pause = vi.fn()
    const unpause = vi.fn()
    Object.defineProperty(SVGSVGElement.prototype, 'pauseAnimations', { configurable: true, value: pause })
    Object.defineProperty(SVGSVGElement.prototype, 'unpauseAnimations', { configurable: true, value: unpause })

    try {
      const loading = mount(LumaLoading)
      await nextTick()
      const loadingObserver = IntersectionObserverMock.instances.at(-1)!
      loadingObserver.emit(false)
      await nextTick()
      await nextTick()
      expect(loading.classes()).toContain('is-animation-paused')
      expect(pause).toHaveBeenCalled()
      loading.unmount()
      expect(loadingObserver.disconnect).toHaveBeenCalled()

      const water = mount(LumaWaterLevelPond, { props: { value: 60 } })
      await flushFrames()
      const waterIntersection = IntersectionObserverMock.instances.at(-1)!
      const waterResize = ResizeObserverMock.instances.at(-1)!
      await water.trigger('focusin')
      await nextTick()
      expect(water.classes()).toContain('is-animation-paused')
      water.unmount()
      expect(waterIntersection.disconnect).toHaveBeenCalled()
      expect(waterResize.disconnect).toHaveBeenCalled()
    }
    finally {
      if (originalPause)
        Object.defineProperty(SVGSVGElement.prototype, 'pauseAnimations', originalPause)
      else
        delete (SVGSVGElement.prototype as Partial<SVGSVGElement>).pauseAnimations
      if (originalUnpause)
        Object.defineProperty(SVGSVGElement.prototype, 'unpauseAnimations', originalUnpause)
      else
        delete (SVGSVGElement.prototype as Partial<SVGSVGElement>).unpauseAnimations
    }
  })
})
