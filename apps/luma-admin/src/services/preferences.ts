import type {
  LumaPreferences,
  LumaPreferencesDefaults,
  ResolvedThemeMode,
  ThemeRuntimeEnvironment,
} from '@luma/core/theme'
import {
  applyThemePreferences,
  createDefaultPreferences,
} from '@luma/core/theme'

/***********************默认偏好*********************/
export const adminPreferenceDefaults: LumaPreferencesDefaults = {
  app: {
    layout: 'mixed-nav',
  },
  sidebar: {
    collapsed: false,
    enable: true,
    width: 248,
  },
  tabbar: {
    cache: true,
    enable: true,
    maxCount: 8,
    showIcon: true,
    showMaximize: true,
  },
  theme: {
    colorPrimary: '#1677ff',
    mode: 'system',
    radiusScale: 0.5,
  },
  transition: {
    enable: true,
    loading: true,
    name: 'fade-side',
    progress: true,
  },
}

/***********************偏好创建*********************/
export function createAdminPreferences(): LumaPreferences {
  return createDefaultPreferences(adminPreferenceDefaults)
}

/***********************主题运行环境*********************/
export function resolveAdminThemeEnvironment(
  documentRef: Document | null | undefined = typeof document === 'undefined' ? undefined : document,
  windowRef: Window | null | undefined = typeof window === 'undefined' ? undefined : window,
): ThemeRuntimeEnvironment {
  if (!documentRef) {
    return {}
  }

  return {
    document: documentRef,
    matchMedia: typeof windowRef?.matchMedia === 'function'
      ? windowRef.matchMedia.bind(windowRef)
      : undefined,
  }
}

/***********************主题应用*********************/
export function applyAdminPreferences(preferences: LumaPreferences): ResolvedThemeMode {
  return applyThemePreferences(preferences, resolveAdminThemeEnvironment())
}
