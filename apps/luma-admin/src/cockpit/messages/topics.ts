/***********************App 业务消息协议*********************/
// 中央组件与业务模块共同依赖本协议。@luma/cockpit 不导入此文件。

export const cockpitTopics = {
  businessItemSelected: 'application:item-selected',
  centerSelectionChanged: 'application:center-selection-changed',
} as const

export interface BusinessItemSelectedPayload {
  id: string
  label?: string
}

export interface CenterSelectionChangedPayload {
  id: string
  source: string
}
