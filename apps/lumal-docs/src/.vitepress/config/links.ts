/**
 * 站点与包外链占位。
 * 本地开发默认指向本机文档站；上线后设置环境变量覆盖。
 *
 * - LUMAL_DOCS_URL        文档站点根地址
 * - LUMAL_ADMIN_DEMO_URL  Admin 演示
 * - LUMAL_COCKPIT_DEMO_URL 驾驶舱演示
 * - LUMAL_DATAV_GUIDE_URL DataV 指南
 * - LUMAL_GITHUB_URL      仓库地址
 * - LUMAL_NPM_SCOPE_URL   npm scope 页
 */
function env(name: string, fallback: string): string {
  return process.env[name] || fallback
}

export const siteLinks = {
  docs: env('LUMAL_DOCS_URL', 'http://localhost:5173'),
  adminDemo: env('LUMAL_ADMIN_DEMO_URL', 'http://localhost:5174'),
  cockpitDemo: env('LUMAL_COCKPIT_DEMO_URL', 'http://localhost:5175'),
  datavGuide: env('LUMAL_DATAV_GUIDE_URL', 'http://localhost:5176'),
  github: env('LUMAL_GITHUB_URL', 'https://github.com/example/lumal'),
  npmScope: env('LUMAL_NPM_SCOPE_URL', 'https://www.npmjs.com/org/lumal'),
  editPattern: env(
    'LUMAL_DOCS_EDIT_PATTERN',
    'https://github.com/example/lumal/edit/main/apps/lumal-docs/src/:path',
  ),
}

/** 各发布包的文档页与 npm 地址（npm 上线前用本地文档路径占位） */
export const packageLinks = {
  core: {
    name: '@lumal/core',
    path: 'packages/core',
    docs: '/packages/core',
    npm: env('LUMAL_NPM_CORE', 'http://localhost:5173/packages/core'),
  },
  icons: {
    name: '@lumal/icons',
    path: 'packages/icons',
    docs: '/packages/icons',
    npm: env('LUMAL_NPM_ICONS', 'http://localhost:5173/packages/icons'),
  },
  iconsVue: {
    name: '@lumal/icons-vue',
    path: 'packages/icons-vue',
    docs: '/packages/icons-vue',
    npm: env('LUMAL_NPM_ICONS_VUE', 'http://localhost:5173/packages/icons-vue'),
  },
  charts: {
    name: '@lumal/charts',
    path: 'packages/charts',
    docs: '/packages/charts',
    npm: env('LUMAL_NPM_CHARTS', 'http://localhost:5173/packages/charts'),
  },
  datav: {
    name: '@lumal/datav',
    path: 'packages/datav',
    docs: '/packages/datav',
    npm: env('LUMAL_NPM_DATAV', 'http://localhost:5173/packages/datav'),
  },
  cockpit: {
    name: '@lumal/cockpit',
    path: 'packages/cockpit',
    docs: '/packages/cockpit',
    npm: env('LUMAL_NPM_COCKPIT', 'http://localhost:5173/packages/cockpit'),
  },
  vite: {
    name: '@lumal/vite',
    path: 'packages/vite',
    docs: '/packages/vite',
    npm: env('LUMAL_NPM_VITE', 'http://localhost:5173/packages/vite'),
  },
  vbenCompat: {
    name: '@lumal/vben-compat',
    path: 'packages/vben-compat',
    docs: '/packages/vben-compat',
    npm: env('LUMAL_NPM_VBEN_COMPAT', 'http://localhost:5173/packages/vben-compat'),
  },
  createLumalAdmin: {
    name: 'create-lumal-admin',
    path: 'packages/create-lumal-admin',
    docs: '/packages/create-lumal-admin',
    npm: env('LUMAL_NPM_CREATE', 'http://localhost:5173/packages/create-lumal-admin'),
  },
} as const
