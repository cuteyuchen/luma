export interface ThemeTransitionOrigin {
  clientX: number
  clientY: number
}

interface ViewTransitionLike {
  finished: Promise<void>
  ready: Promise<void>
}

type ThemeTransitionDocument = Pick<Document, 'documentElement'> & {
  startViewTransition?: (update: () => void) => ViewTransitionLike
}

export interface ThemeTransitionEnvironment {
  document?: ThemeTransitionDocument
  matchMedia?: (query: string) => Pick<MediaQueryList, 'matches'>
  viewport?: Pick<Window, 'innerHeight' | 'innerWidth'>
}

let transitionRunning = false

function resolveEnvironment(): ThemeTransitionEnvironment {
  return {
    document: typeof document === 'undefined' ? undefined : document,
    matchMedia: typeof window === 'undefined' || typeof window.matchMedia !== 'function'
      ? undefined
      : window.matchMedia.bind(window),
    viewport: typeof window === 'undefined' ? undefined : window,
  }
}

export async function runAdminThemeTransition(
  updateTheme: () => void,
  origin?: ThemeTransitionOrigin,
  environment: ThemeTransitionEnvironment = resolveEnvironment(),
): Promise<void> {
  const documentRef = environment.document
  const viewport = environment.viewport
  const reduceMotion = environment.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

  if (
    transitionRunning
    || reduceMotion
    || !documentRef?.startViewTransition
    || !viewport
    || typeof documentRef.documentElement.animate !== 'function'
  ) {
    if (!transitionRunning) {
      updateTheme()
    }
    return
  }

  transitionRunning = true
  const wasDark = documentRef.documentElement.classList.contains('dark')
  const x = Math.max(0, Math.min(origin?.clientX ?? viewport.innerWidth - 28, viewport.innerWidth))
  const y = Math.max(0, Math.min(origin?.clientY ?? 28, viewport.innerHeight))
  const radius = Math.hypot(
    Math.max(x, viewport.innerWidth - x),
    Math.max(y, viewport.innerHeight - y),
  )
  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${radius}px at ${x}px ${y}px)`,
  ]

  try {
    const transition = documentRef.startViewTransition(updateTheme)
    await transition.ready
    const animation = documentRef.documentElement.animate(
      { clipPath: wasDark ? clipPath : [...clipPath].reverse() },
      {
        duration: 360,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        pseudoElement: wasDark ? '::view-transition-new(root)' : '::view-transition-old(root)',
      },
    )
    await Promise.allSettled([animation.finished, transition.finished])
  }
  finally {
    transitionRunning = false
  }
}
