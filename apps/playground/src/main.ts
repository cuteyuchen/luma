import type { IconDefinition } from '@luma/icons'
import { createLumaAdmin } from '@luma/core'
import App from './App.vue'
import '@luma/core/theme-chalk/index.scss'
import '@luma/core/style.css'
import '@luma/icons/style.css'
import './styles.scss'

/***********************本地图标定义*********************/
const localIcons: IconDefinition[] = [
  {
    key: 'playground:form',
    label: '表单',
    source: 'local-svg',
    svgText: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 5h10V6H7v2Zm0 5h10v-2H7v2Zm0 5h7v-2H7v2Z"/></svg>',
  },
  {
    key: 'playground:table',
    label: '表格',
    source: 'local-svg',
    svgText: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Zm2 3h12V5H6v3Zm0 5h5v-3H6v3Zm7 0h5v-3h-5v3Zm-7 6h5v-4H6v4Zm7 0h5v-4h-5v4Z"/></svg>',
  },
  {
    key: 'playground:theme',
    label: '主题',
    source: 'local-svg',
    svgText: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 3a9 9 0 0 0 0 18h.7a2.3 2.3 0 0 0 1.7-3.9 1.2 1.2 0 0 1 .8-2.1H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8ZM7.5 11A1.5 1.5 0 1 1 7.5 8a1.5 1.5 0 0 1 0 3Zm3-3A1.5 1.5 0 1 1 10.5 5a1.5 1.5 0 0 1 0 3Zm3 0A1.5 1.5 0 1 1 13.5 5a1.5 1.5 0 0 1 0 3Zm3 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"/></svg>',
  },
]

/***********************应用启动*********************/
createLumaAdmin({
  rootComponent: App,
  icons: {
    localSvg: localIcons,
  },
}).mount('#app')
