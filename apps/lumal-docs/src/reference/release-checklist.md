# 发布检查清单

发布前需要确认包内容、依赖方向、文档和示例应用都处于可发布状态。

## 命名检查

```bash
rg -n "guiren|gr-framework|GrFramework|GSchemaForm|GSchemaTable|GCrudTable|GPage|GPagination" README.md docs packages apps --glob "!docs/release-checklist.md"
```

当前首版不保留 `G*` 组件别名，公开 API 使用 `Lumal*` 命名。如果后续为了迁移保留别名，需要明确写成兼容 API，不能作为推荐 API。

## 依赖方向

- `@lumal/icons` 保持零运行时依赖和零 Vue 引用。
- `@lumal/icons-vue` 只依赖 `@lumal/icons`，并把 Vue 与 Iconify Vue 保持为 peer dependency。
- `@lumal/core` 不依赖 `@lumal/vben-compat`。
- Element Plus 保持为 `@lumal/core` 的 peer dependency，Lumal 不从零重写基础 UI 控件。
- `@lumal/core` 不默认依赖 VXE。
- `@lumal/core` 不默认引入多语言运行时。
- `@lumal/charts` 将 ECharts 和 vue-echarts 保持为 peer dependency。
- `@lumal/cockpit` 依赖 `@lumal/core`，`@lumal/core` 不反向依赖 `@lumal/cockpit`；`@lumal/cockpit` 不依赖 `@lumal/charts` 或任何地图/图表运行时。
- `@lumal/vite` 不引入强制运行时依赖。

## 验证命令

推荐直接运行串行发布检查，避免多个构建命令同时清理和重写 `dist`：

```bash
pnpm release:check
```

其中 `release:boundaries` 会作为发布检查的一部分自动执行；如果只想快速检查包边界，可以单独运行：

```bash
pnpm release:boundaries
```

首次发布前还需要检查目标包名是否已被 npm registry 占用：

```bash
pnpm release:names
```

这个命令验证 `@lumal/icons`、`@lumal/icons-vue`、`@lumal/core`、`@lumal/charts`、`@lumal/datav`、`@lumal/cockpit`、`@lumal/vben-compat`、`@lumal/vite`、`create-lumal-admin` 是否能在 registry 查询到；它不能证明发布账号拥有或可创建 `@lumal` scope。

拆开执行时也必须保持串行：

```bash
pnpm lint
pnpm release:boundaries
pnpm test
pnpm typecheck
pnpm build
pnpm admin:build
pnpm compat:build
pnpm release:artifacts
pnpm test:e2e
pnpm pack:dry-run
```

## 发包 dry-run

```bash
pnpm pack:dry-run
```

等价于：

```bash
pnpm --filter @lumal/icons pack --dry-run
pnpm --filter @lumal/icons-vue pack --dry-run
pnpm --filter @lumal/core pack --dry-run
pnpm --filter @lumal/charts pack --dry-run
pnpm --filter @lumal/datav pack --dry-run
pnpm --filter @lumal/cockpit pack --dry-run
pnpm --filter @lumal/vben-compat pack --dry-run
pnpm --filter @lumal/vite pack --dry-run
pnpm --filter create-lumal-admin pack --dry-run
```

检查 tarball 内容：

- 包含 `dist`。
- 包含包内 `README.md`。
- `@lumal/core` 包含 `theme-chalk/index.scss` 和 `dist/core.css`。
- `@lumal/icons-vue` 包含 `dist/icons-vue.css`。
- `@lumal/cockpit` 包含 `dist/cockpit.css` 及 `dist/runtime.js`、`dist/designer.js` 独立入口。
- `create-lumal-admin` 包含 `dist/cli.js` 和 `dist/index.js`。
- 不包含 `apps/*`。
- 不包含本地日志、IDE 文件和构建缓存。

## 浏览器与产物检查

- Chromium E2E 覆盖登录与动态菜单、403/404/退出、标签和设置持久化、用户查询/新增、会话凭据失效。
- 移动端流程验证 375px 下不存在页面级横向溢出。
- `release:artifacts` 检查必要构建产物、`vendor-echarts`、`vendor-element-plus`、`vendor-lumal` 分包和 500 KB 单块上限。
- 当前完整 `release:check` 已通过，Admin 最大 JavaScript 块为 152,672 bytes。

## 文档检查

- README 与当前实现一致。
- `docs/development-roadmap.md` 是唯一开发规划和阶段状态来源。
- `docs/architecture.md` 说明包边界。
- `docs/icons.md` 说明图标注册、渲染和选择器。
- `docs/core-api.md` 说明 core 公开入口。
- `docs/migration-from-vben.md` 说明兼容映射、迁移边界和不支持项。

## npm scope

当前按 `@lumal` 规划。`pnpm release:names` 用于检查目标包名是否能在 registry 查询到。

scope 权限已用当前 npm 用户 `cuteyuchen` 确认：

```bash
npm whoami --registry=https://registry.npmjs.org
npm org ls lumal --registry=https://registry.npmjs.org
npm access list packages @lumal --registry=https://registry.npmjs.org
```

确认结果：当前账号是 `lumal` 组织 owner，并且可以列出 `@lumal` scope 下已有包。

## License

当前使用 MIT License。发布边界检查会确认根目录 `LICENSE` 存在，并确认各发布包 `package.json` 的 `license` 字段为 `MIT`。
