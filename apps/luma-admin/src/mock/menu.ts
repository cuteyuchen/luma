import type { SystemMenuRecord } from './system'
import { mockFetchSystemMenus } from './system'

function toCompanyMenu(record: SystemMenuRecord): Record<string, unknown> {
  const children = record.children?.filter(child => child.type !== 'button').map(toCompanyMenu)
  const authority = record.permissions?.length
    ? record.permissions
    : record.permission ? [record.permission] : undefined

  return {
    authCode: authority,
    menuIcon: record.icon,
    menuName: record.title,
    menuType: record.type,
    meta: {
      externalTarget: record.externalTarget,
      hideInMenu: record.hidden,
    },
    nodes: children,
    redirect: record.redirect,
    routeName: record.name || record.id,
    routePath: record.path,
    sortNo: record.order,
    url: record.externalLink,
    viewPath: record.component,
  }
}

/***********************菜单接口模拟*********************/
export async function mockLoadAdminMenus(): Promise<Record<string, unknown>> {
  const menus = await mockFetchSystemMenus()

  return {
    result: menus.filter(menu => menu.type !== 'button').map(toCompanyMenu),
    resultMsg: 'ok',
    statusCode: '0000',
  }
}
