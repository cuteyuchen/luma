export interface ResolveLumalDevtoolsPluginOptions<T> {
  enabled?: boolean
  factory?: () => T
  plugin?: T
}

/**
 * 按需接入调用方已经安装的 Devtools 插件，不把具体实现变成 Lumal 强制依赖。
 */
export function resolveLumalDevtoolsPlugin<T>(
  options: ResolveLumalDevtoolsPluginOptions<T> = {},
): T | undefined {
  if (options.enabled === false) {
    return undefined
  }

  return options.factory?.() ?? options.plugin
}
