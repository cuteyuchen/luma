# 登录与会话

## 原则

登录页、Token 存储、刷新接口字段均在 **应用层** 实现。`@luma/core` 提供请求刷新单飞、权限上下文与布局壳，不绑定固定登录 API。

## 典型流程

1. 用户提交账号密码 → 应用调用 `POST /auth/login`
2. 保存 `{ accessToken, refreshToken?, expiresAt? }`
3. 拉取当前用户与权限码 → 写入 permission store
4. 加载菜单 → `createMenuRouteRuntime` 注册动态路由
5. 进入后台布局

## 脚手架中的示例

`create-luma-admin --api-mode http` 会生成：

- 环境变量 `VITE_API_BASE_URL`
- `createRequestClient` 封装
- 登录 / 刷新示意
- `API-CONTRACT.md` 建议接口列表

## 登出

应用需：

1. 清理会话存储
2. 重置权限与动态路由
3. 跳转登录页

Admin 示例见 `apps/luma-admin` 会话与守卫实现。
