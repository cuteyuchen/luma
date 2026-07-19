/***********************框架级消息 topic*********************/
// 业务 topic 由消费应用自行定义；此处仅声明框架广播的固定 topic。

/** 全局刷新广播：模块订阅后重新请求接口 / 重载数据。 */
export const COCKPIT_REFRESH_TOPIC = 'cockpit:refresh'

export interface CockpitRefreshPayload {
  /** 触发来源：定时器或手动。 */
  reason: 'interval' | 'manual'
  /** 本次触发时间戳（ms）。 */
  at: number
}
