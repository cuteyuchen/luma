declare module '@jiaminghi/charts' {
  interface ChartsGraph {
    animationEnd: () => void
  }

  export default class Charts {
    constructor(container: HTMLElement)
    canvas: HTMLCanvasElement
    container: HTMLElement
    option: Record<string, unknown> | null
    render: { graphs: ChartsGraph[] }
    resize: () => void
    setOption: (option: Record<string, unknown>, animationEnd?: boolean) => boolean | void
  }
}
