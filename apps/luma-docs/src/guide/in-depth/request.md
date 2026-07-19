# 请求与适配

## 创建客户端

```ts
import { createRequestClient } from '@luma/core/request'

export const request = createRequestClient({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  getAccessToken: () => getSession()?.accessToken,
  refresh: async () => {
    const data = await refreshApi()
    setSession(data)
    return data.accessToken
  },
})
```

## 分页标准

```ts
{ items: T[], total: number }
```

CRUD `dataSource.parseResponse` 用于映射非标准响应：

```ts
parseResponse: res => ({
  items: res.records,
  total: res.count,
})
```

## 错误与刷新

- 统一错误类型便于 UI 展示
- Token 刷新 **单飞**，并发请求排队重放
- 业务状态码判断留在应用 interceptor / adapter
