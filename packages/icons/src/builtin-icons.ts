import type { IconDefinition } from './types'

function icon(key: string, label: string, body: string): IconDefinition {
  return {
    group: 'luma',
    key: `luma:${key}`,
    label,
    source: 'local-svg',
    svgText: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">${body}</svg>`,
  }
}

export const builtinIconDefinitions: IconDefinition[] = [
  icon('sun', '浅色模式', '<circle cx="12" cy="12" r="4" fill="currentColor"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'),
  icon('moon', '深色模式', '<path d="M20.2 15.4A8.5 8.5 0 0 1 8.6 3.8 8.5 8.5 0 1 0 20.2 15.4Z" fill="currentColor"/>'),
  icon('monitor', '跟随系统', '<rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M8 21h8M12 17v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'),
  icon('palette', '主题设置', '<path d="M12 3a9 9 0 0 0 0 18h1.3a2.2 2.2 0 0 0 1.56-3.76l-.38-.38a1.1 1.1 0 0 1 .78-1.86H17a4 4 0 0 0 3.72-5.47A9 9 0 0 0 12 3Z" stroke="currentColor" stroke-width="1.7"/><circle cx="7.5" cy="10" r="1.2" fill="currentColor"/><circle cx="10.5" cy="6.8" r="1.2" fill="currentColor"/><circle cx="15" cy="7.5" r="1.2" fill="currentColor"/>'),
  icon('settings', '设置', '<path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" stroke="currentColor" stroke-width="1.8"/><path d="m19.4 15 .1-1-.1-1 2-1.5-2-3.4-2.5 1a8 8 0 0 0-1.7-1L14.8 5h-4l-.4 3.1a8 8 0 0 0-1.7 1l-2.5-1-2 3.4 2 1.5-.1 1 .1 1-2 1.5 2 3.4 2.5-1a8 8 0 0 0 1.7 1l.4 3.1h4l.4-3.1a8 8 0 0 0 1.7-1l2.5 1 2-3.4-2-1.5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>'),
  icon('reset', '恢复默认', '<path d="M4 7v5h5M5.5 11A7 7 0 1 1 7 18.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'),
]
