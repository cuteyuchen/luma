import type { Component } from 'vue'
import { LumalIcon, LumalIconPicker, LumalIconPickerDialog } from '@lumal/icons-vue'
import { LumalCrudTable } from '../components/crud-table'
import { LumalInfoTable } from '../components/info-table'
import { LumalPage } from '../components/page'
import { LumalPageLayout } from '../components/page-layout'
import { LumalPagination } from '../components/pagination'
import { LumalSchemaForm } from '../components/schema-form'
import { LumalSchemaTable } from '../components/schema-table'
import {
  LumalBreadcrumb,
  LumalContent,
  LumalGlobalSearch,
  LumalHeader,
  LumalLayout,
  LumalRouterView,
  LumalSidebar,
  LumalTabs,
  LumalTopNav,
} from '../layout'
import { LumalAccessControl } from '../permission'
import LumalThemeSettingsPanel from '../theme/LumalThemeSettingsPanel.vue'

/***********************默认组件注册表*********************/
export const defaultLumalComponents: Record<string, Component> = {
  LumalAccessControl,
  LumalBreadcrumb,
  LumalContent,
  LumalCrudTable,
  LumalHeader,
  LumalIcon,
  LumalIconPicker,
  LumalIconPickerDialog,
  LumalInfoTable,
  LumalGlobalSearch,
  LumalLayout,
  LumalPage,
  LumalPageLayout,
  LumalPagination,
  LumalRouterView,
  LumalSchemaForm,
  LumalSchemaTable,
  LumalSidebar,
  LumalTabs,
  LumalThemeSettingsPanel,
  LumalTopNav,
}
