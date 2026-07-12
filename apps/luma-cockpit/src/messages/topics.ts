/***********************独立应用业务消息协议*********************/
// 独立应用自行维护 topic 与 payload 类型，@luma/cockpit 不导入此文件。

export const cockpitTopics = {
  nodeSelected: 'standalone:node-selected',
  centerReady: 'standalone:center-ready',
} as const

export interface NodeSelectedPayload {
  id: string
}
