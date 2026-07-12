import type { CockpitConfig } from '@luma/cockpit'
import { prepareCockpitConfig } from '@luma/cockpit'
import { adminRequest } from '../../services/request'

/***********************驾驶舱配置持久化适配层*********************/
// App 负责字段转换与 HTTP 请求；后端字段和状态码不进入 @luma/cockpit。

export interface CockpitConfigRepository {
  load: (id: string) => Promise<CockpitConfig>
  save: (config: CockpitConfig) => Promise<CockpitConfig>
}

/** 把任意后端响应转换为标准、可安全渲染的 CockpitConfig */
function toStandardConfig(raw: unknown): CockpitConfig {
  return prepareCockpitConfig(raw)
}

export const adminCockpitRepository: CockpitConfigRepository = {
  async load(_id: string): Promise<CockpitConfig> {
    const response = await adminRequest.get('/cockpit/config')
    return toStandardConfig(response)
  },
  async save(config: CockpitConfig): Promise<CockpitConfig> {
    const response = await adminRequest.put('/cockpit/config', {
      body: { ...config },
      retryOnAuthRefresh: true,
    })
    return toStandardConfig(response)
  },
}
