import type { CreateLumaAdminOptions, LumaAdminInstance } from './types'
import { registerStaticLocalSvgIcons } from '@luma/icons'
import { createApp } from 'vue'

/***********************应用创建*********************/
export function createLumaAdmin(options: CreateLumaAdminOptions): LumaAdminInstance {
  const app = createApp(options.rootComponent, options.rootProps)

  if (options.icons?.localSvg?.length) {
    registerStaticLocalSvgIcons(options.icons.localSvg)
  }

  const context = { app }
  void options.setup?.(context)

  return {
    app,
    use: app.use.bind(app),
    mount: app.mount.bind(app),
  }
}
