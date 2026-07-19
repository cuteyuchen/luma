/**
 * 站点与包外链占位。
 * 本地开发默认指向本机文档站；上线后设置环境变量覆盖。
 *
 * - LUMA_DOCS_URL        文档站点根地址
 * - LUMA_ADMIN_DEMO_URL  Admin 演示
 * - LUMA_COCKPIT_DEMO_URL 驾驶舱演示
 * - LUMA_DATAV_GUIDE_URL DataV 指南
 * - LUMA_GITHUB_URL      仓库地址
 * - LUMA_NPM_SCOPE_URL   npm scope 页
 */
function env(name: string, fallback: string): string {
  return process.env[name] || fallback
}

export const siteLinks = {
  docs: env('LUMA_DOCS_URL', 'http://localhost:5173'),
  adminDemo: env('LUMA_ADMIN_DEMO_URL', 'http://localhost:5174'),
  cockpitDemo: env('LUMA_COCKPIT_DEMO_URL', 'http://localhost:5175'),
  datavGuide: env('LUMA_DATAV_GUIDE_URL', 'http://localhost:5176'),
  github: env('LUMA_GITHUB_URL', 'https://github.com/example/luma'),
  npmScope: env('LUMA_NPM_SCOPE_URL', 'https://www.npmjs.com/org/luma'),
  editPattern: env(
    'LUMA_DOCS_EDIT_PATTERN',
    'https://github.com/example/luma/edit/main/apps/luma-docs/src/:path',
  ),
}

/** 各发布包的文档页与 npm 地址（npm 上线前用本地文档路径占位） */
export const packageLinks = {
  core: {
    name: '@luma/core',
    path: 'packages/core',
    docs: '/packages/core',
    npm: env('LUMA_NPM_CORE', 'http://localhost:5173/packages/core'),
  },
  icons: {
    name: '@luma/icons',
    path: 'packages/icons',
    docs: '/packages/icons',
    npm: env('LUMA_NPM_ICONS', 'http://localhost:5173/packages/icons'),
  },
  iconsVue: {
    name: '@luma/icons-vue',
    path: 'packages/icons-vue',
    docs: '/packages/icons-vue',
    npm: env('LUMA_NPM_ICONS_VUE', 'http://localhost:5173/packages/icons-vue'),
  },
  charts: {
    name: '@luma/charts',
    path: 'packages/charts',
    docs: '/packages/charts',
    npm: env('LUMA_NPM_CHARTS', 'http://localhost:5173/packages/charts'),
  },
  datav: {
    name: '@luma/datav',
    path: 'packages/datav',
    docs: '/packages/datav',
    npm: env('LUMA_NPM_DATAV', 'http://localhost:5173/packages/datav'),
  },
  cockpit: {
    name: '@luma/cockpit',
    path: 'packages/cockpit',
    docs: '/packages/cockpit',
    npm: env('LUMA_NPM_COCKPIT', 'http://localhost:5173/packages/cockpit'),
  },
  vite: {
    name: '@luma/vite',
    path: 'packages/vite',
    docs: '/packages/vite',
    npm: env('LUMA_NPM_VITE', 'http://localhost:5173/packages/vite'),
  },
  vbenCompat: {
    name: '@luma/vben-compat',
    path: 'packages/vben-compat',
    docs: '/packages/vben-compat',
    npm: env('LUMA_NPM_VBEN_COMPAT', 'http://localhost:5173/packages/vben-compat'),
  },
  createLumaAdmin: {
    name: 'create-luma-admin',
    path: 'packages/create-luma-admin',
    docs: '/packages/create-luma-admin',
    npm: env('LUMA_NPM_CREATE', 'http://localhost:5173/packages/create-luma-admin'),
  },
} as const
