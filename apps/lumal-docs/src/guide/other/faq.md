# 常见问题

## 为什么要先 build 包？

外部 `file:` 依赖与 `target: 'dist'` 需要完整 `exports` 指向 `dist`。monorepo 内 `admin:dev` 使用 source alias，可跳过预构建。

## 能把业务状态码写进 core 吗？

不能。在应用 adapter / `parseResponse` 中转换。

## 文档站和仓库 `docs/` 什么关系？

- 长文参考以 `docs/*.md` 为源，同步到 `apps/lumal-docs/src/reference/`
- 指南 / 组件 / 包使用以文档站为权威入口
- 根 README 指向 `pnpm docs:dev`

## 演示链接打不开？

当前为本地占位端口。启动对应 app 或设置 `LUMAL_*_DEMO_URL` 后重新构建文档。

## 与 Vben 文档站关系？

信息架构参考 [Vben 文档](https://doc.vben.pro/)，实现与 API 为 Lumal 自有，不共用组件库。
