# 服务端交互与数据 Mock

## 请求客户端

```ts
import { createRequestClient } from '@luma/core/request'

const client = createRequestClient({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  getAccessToken: () => session.accessToken,
  refresh: () => authApi.refresh(),
})
```

支持统一错误处理、Token 刷新单飞与安全重放。详见 [请求与适配](../in-depth/request) 与 [Core API](/reference/core-api)。

## Mock

仓库内 `apps/luma-mock-api` 基于 Nitro/H3，供 Admin 验收：

```bash
pnpm admin:dev
```

说明见 [Mock API](/reference/mock-api)。

## 业务边界

- 接口路径、状态码、字段名在 **应用层** 定义
- 脚手架 `http` 模式会生成 `API-CONTRACT.md` 作为接入说明模板
- 不要把公司业务协议写入 `@luma/core`
