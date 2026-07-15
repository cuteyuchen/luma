import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { LumaDecoration } from '../src'

const signatures = [
  { animate: 16, circles: 0, paths: 0, polygons: 0, polylines: 0, rects: 33, svgs: 1, uses: 0 },
  { animate: 2, circles: 0, paths: 0, polygons: 0, polylines: 0, rects: 2, svgs: 1, uses: 0 },
  { animate: 17, circles: 0, paths: 0, polygons: 0, polylines: 0, rects: 50, svgs: 1, uses: 0 },
  { animate: 0, circles: 0, paths: 0, polygons: 0, polylines: 2, rects: 0, svgs: 1, uses: 0 },
  { animate: 2, circles: 0, paths: 0, polygons: 0, polylines: 2, rects: 0, svgs: 1, uses: 0 },
  { animate: 80, circles: 0, paths: 0, polygons: 0, polylines: 0, rects: 40, svgs: 1, uses: 0 },
  { animate: 0, circles: 0, paths: 0, polygons: 0, polylines: 4, rects: 0, svgs: 2, uses: 0 },
  { animate: 0, circles: 0, paths: 0, polygons: 0, polylines: 3, rects: 0, svgs: 1, uses: 0 },
  { animate: 22, circles: 4, paths: 0, polygons: 1, polylines: 0, rects: 0, svgs: 1, uses: 20 },
  { animate: 13, circles: 4, paths: 0, polygons: 0, polylines: 4, rects: 0, svgs: 1, uses: 0 },
  { animate: 0, circles: 0, paths: 0, polygons: 5, polylines: 2, rects: 0, svgs: 1, uses: 0 },
  { animate: 3, circles: 5, paths: 34, polygons: 0, polylines: 6, rects: 0, svgs: 1, uses: 1 },
] as const

const defaultColors = [
  '#fff',
  '#3faacb',
  '#7acaec',
  'rgba(255, 255, 255, 0.3)',
  '#3f96a5',
  '#7acaec',
  '#1dc1f5',
  '#3f96a5',
  'rgba(3, 166, 224, 0.8)',
  '#00c2ff',
  '#1a98fc',
  '#2783ce',
] as const

function installMatchMedia(matches = false): void {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn().mockReturnValue({
      addEventListener: vi.fn(),
      matches,
      removeEventListener: vi.fn(),
    }),
  })
}

beforeEach(() => installMatchMedia())

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('lumaDecoration DataV SVG fidelity', () => {
  it('12 variants preserve the upstream SVG element signatures and defaults', () => {
    signatures.forEach((signature, index) => {
      const variant = index + 1 as 1
      const wrapper = mount(LumaDecoration, { props: { variant } })

      expect(wrapper.findAll('svg')).toHaveLength(signature.svgs)
      if (variant === 1 || variant === 3)
        expect(wrapper.findAll('animate, animateTransform').length).toBeLessThanOrEqual(signature.rects)
      else
        expect(wrapper.findAll('animate, animateTransform')).toHaveLength(signature.animate)
      expect(wrapper.findAll('circle')).toHaveLength(signature.circles)
      expect(wrapper.findAll('path')).toHaveLength(signature.paths)
      expect(wrapper.findAll('polygon')).toHaveLength(signature.polygons)
      expect(wrapper.findAll('polyline')).toHaveLength(signature.polylines)
      if (variant === 1) {
        expect(wrapper.findAll('rect').length).toBeGreaterThanOrEqual(2)
        expect(wrapper.findAll('rect').length).toBeLessThanOrEqual(82)
      }
      else {
        expect(wrapper.findAll('rect')).toHaveLength(signature.rects)
      }
      expect(wrapper.findAll('use')).toHaveLength(signature.uses)
      expect(wrapper.attributes('style')).toContain(`--luma-datav-primary: ${defaultColors[index]}`)
      wrapper.unmount()
    })
  })

  it('creates upstream random geometry once per instance and preserves it across updates', async () => {
    const wrapper = mount(LumaDecoration, { props: { variant: 1 } })
    const initial = wrapper.findAll('.luma-decoration__mark').map(mark => ({
      begin: mark.find('animate').exists() ? mark.find('animate').attributes('begin') : '',
      x: mark.attributes('x'),
      y: mark.attributes('y'),
    }))
    await wrapper.setProps({ background: '#001122' })
    expect(wrapper.findAll('.luma-decoration__mark')).toHaveLength(initial.length)
    expect(wrapper.findAll('.luma-decoration__mark').map(mark => ({
      begin: mark.find('animate').exists() ? mark.find('animate').attributes('begin') : '',
      x: mark.attributes('x'),
      y: mark.attributes('y'),
    }))).toEqual(initial)

    await wrapper.setProps({ variant: 6 })
    const bars = wrapper.findAll('.luma-decoration__bar').map(bar => ({
      fill: bar.attributes('fill'),
      height: bar.attributes('height'),
      y: bar.attributes('y'),
    }))
    await wrapper.setProps({ background: '#112233' })
    expect(wrapper.findAll('.luma-decoration__bar').map(bar => ({
      fill: bar.attributes('fill'),
      height: bar.attributes('height'),
      y: bar.attributes('y'),
    }))).toEqual(bars)
  })

  it('keeps referenced SVG ids unique and preserves the seven-stage sequence', () => {
    const first = mount(LumaDecoration, { props: { variant: 9 } })
    const second = mount(LumaDecoration, { props: { variant: 9 } })
    const firstPolygon = first.get('defs > polygon')
    const secondPolygon = second.get('defs > polygon')
    expect(firstPolygon.attributes('id')).not.toBe(secondPolygon.attributes('id'))
    expect(first.get('use').attributes('href')).toBe(`#${firstPolygon.attributes('id')}`)

    const sequence = mount(LumaDecoration, { props: { duration: 4200, variant: 10 } })
    const ids = sequence.findAll('animate[id]').map(animation => animation.attributes('id'))
    expect(new Set(ids)).toHaveLength(7)
    expect(sequence.findAll('.luma-decoration__segment')).toHaveLength(3)
    expect(sequence.findAll('.luma-decoration__segment')[0]?.get('animate[id]').attributes('dur')).toBe('4.2s')
  })

  it('maps duration and reverse to upstream orientation and scan direction', () => {
    const line = mount(LumaDecoration, {
      props: { color: ['#123456', '#abcdef'], dur: 1.2, reverse: true, variant: 2 },
    })
    expect(line.get('rect animate').attributes('attributeName')).toBe('height')
    expect(line.get('rect animate').attributes('dur')).toBe('1.2s')
    expect(line.attributes('style')).toContain('--luma-datav-duration: 1200ms')

    const ring = mount(LumaDecoration, { props: { dur: 4.2, reverse: true, variant: 9 } })
    expect(ring.get('animateTransform').attributes('dur')).toBe('4.2s')
    expect(ring.get('animateTransform').attributes('values')).toContain('-360')

    const radar = mount(LumaDecoration, { props: { haloDur: 1.4, scanDur: 5, variant: 12 } })
    expect(radar.get('animateTransform').attributes('dur')).toBe('5s')
    expect(radar.findAll('circle animate')[0]?.attributes('dur')).toBe('1.4s')
  })

  it('preserves every upstream animation timeline and keyframe sequence', () => {
    const one = mount(LumaDecoration, { props: { variant: 1 } })
    expect(one.findAll('.luma-decoration__mark animate').every(animation => animation.attributes('dur') === '1s')).toBe(true)
    expect(one.findAll('rect:not(.luma-decoration__mark) animate')[0]?.attributes('dur')).toBe('2s')

    const two = mount(LumaDecoration, { props: { variant: 2 } })
    expect(two.get('animate').attributes()).toMatchObject({
      calcMode: 'spline',
      dur: '6s',
      keySplines: '.42,0,.58,1',
    })

    const three = mount(LumaDecoration, { props: { variant: 3 } })
    expect(three.findAll('animate').every((animation) => {
      const seconds = Number.parseFloat(animation.attributes('dur'))
      return seconds >= 1 && seconds <= 2
    })).toBe(true)

    const four = mount(LumaDecoration, { props: { variant: 4 } })
    expect(four.get('.luma-decoration__line-reveal').attributes('style')).toContain('animation-duration: 3s')

    const five = mount(LumaDecoration, { props: { variant: 5 } })
    expect(five.findAll('animate').every(animation => animation.attributes('dur') === '1.2s')).toBe(true)
    expect(five.get('animate').attributes('keySplines')).toBe('.4,1,.49,.98')

    const six = mount(LumaDecoration, { props: { variant: 6 } })
    expect(six.findAll('.luma-decoration__bar animate:first-child').every((animation) => {
      const seconds = Number.parseFloat(animation.attributes('dur'))
      return seconds >= 1.5 && seconds <= 2.5
    })).toBe(true)
    expect(six.get('.luma-decoration__bar animate:last-child').attributes('values').split(';')).toHaveLength(3)

    const nine = mount(LumaDecoration, { props: { variant: 9 } })
    const ringAnimations = nine.findAll('circle animateTransform')
    expect(ringAnimations[0]?.attributes('values')).toBe('0 50 50;360 50 50')
    expect(ringAnimations[1]?.attributes('values')).toBe('0 50 50;-360 50 50')
    expect(nine.findAll('use animateTransform')[19]?.attributes('begin')).toBe('2.85s')

    const ten = mount(LumaDecoration, { props: { variant: 10 } })
    expect(ten.findAll('animate[id]')).toHaveLength(7)
    expect(ten.findAll('.luma-decoration__segment')[1]?.get('animate[id]').attributes('begin')).toContain('.end + 1s')

    const twelve = mount(LumaDecoration, { props: { variant: 12 } })
    expect(twelve.get('use animateTransform').attributes('dur')).toBe('3s')
    expect(twelve.findAll('circle animate').map(animation => animation.attributes('dur'))).toEqual(['2s', '2s'])
  })

  it('pauses and resumes SMIL on hover, focus, and reduced-motion', async () => {
    const originalPause = Object.getOwnPropertyDescriptor(SVGSVGElement.prototype, 'pauseAnimations')
    const originalUnpause = Object.getOwnPropertyDescriptor(SVGSVGElement.prototype, 'unpauseAnimations')
    const pause = vi.fn()
    const unpause = vi.fn()
    Object.defineProperty(SVGSVGElement.prototype, 'pauseAnimations', { configurable: true, value: pause })
    Object.defineProperty(SVGSVGElement.prototype, 'unpauseAnimations', { configurable: true, value: unpause })

    try {
      const wrapper = mount(LumaDecoration, { props: { variant: 9 } })
      await nextTick()
      await wrapper.trigger('mouseenter')
      await nextTick()
      expect(pause).toHaveBeenCalled()

      await wrapper.trigger('mouseleave')
      await nextTick()
      expect(unpause).toHaveBeenCalled()

      await wrapper.trigger('focusin')
      await nextTick()
      expect(pause).toHaveBeenCalledTimes(2)
      wrapper.unmount()

      installMatchMedia(true)
      const pauseCount = pause.mock.calls.length
      const reduced = mount(LumaDecoration, { props: { variant: 12 } })
      await nextTick()
      expect(reduced.classes()).toContain('is-animation-paused')
      expect(pause.mock.calls.length).toBeGreaterThan(pauseCount)
      reduced.unmount()
    }
    finally {
      if (originalPause)
        Object.defineProperty(SVGSVGElement.prototype, 'pauseAnimations', originalPause)
      else
        delete (SVGSVGElement.prototype as { pauseAnimations?: () => void }).pauseAnimations
      if (originalUnpause)
        Object.defineProperty(SVGSVGElement.prototype, 'unpauseAnimations', originalUnpause)
      else
        delete (SVGSVGElement.prototype as { unpauseAnimations?: () => void }).unpauseAnimations
    }
  })

  it('coalesces ResizeObserver measurements through requestAnimationFrame', async () => {
    let clientWidth = 300
    let clientHeight = 40
    let resizeCallback: ResizeObserverCallback | undefined
    let nextFrame = 0
    const frames = new Map<number, FrameRequestCallback>()
    const disconnect = vi.fn()
    const widthDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth')
    const heightDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight')

    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get: () => clientWidth })
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, get: () => clientHeight })
    vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => {
      nextFrame += 1
      frames.set(nextFrame, callback)
      return nextFrame
    }))
    vi.stubGlobal('cancelAnimationFrame', vi.fn((id: number) => frames.delete(id)))
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: ResizeObserverCallback) {
        resizeCallback = callback
      }

      disconnect = disconnect
      observe = vi.fn()
    })

    try {
      const wrapper = mount(LumaDecoration, { props: { variant: 8 } })
      const runFrame = (): void => {
        const entry = [...frames.entries()].at(-1)
        if (!entry)
          return
        frames.delete(entry[0])
        entry[1](0)
      }
      runFrame()
      await nextTick()
      expect(wrapper.get('svg').attributes()).toMatchObject({ height: '40', width: '300' })

      clientWidth = 480
      clientHeight = 52
      resizeCallback?.([], {} as ResizeObserver)
      resizeCallback?.([], {} as ResizeObserver)
      expect(frames).toHaveLength(1)
      runFrame()
      await nextTick()
      expect(wrapper.get('svg').attributes()).toMatchObject({ height: '52', width: '480' })
      wrapper.unmount()
      expect(disconnect).toHaveBeenCalled()
    }
    finally {
      if (widthDescriptor)
        Object.defineProperty(HTMLElement.prototype, 'clientWidth', widthDescriptor)
      if (heightDescriptor)
        Object.defineProperty(HTMLElement.prototype, 'clientHeight', heightDescriptor)
    }
  })
})
