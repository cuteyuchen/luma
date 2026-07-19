---
layout: home
title: Luma
titleTemplate: 轻量 Vue Admin 基础设施

hero:
  name: Luma
  text: 轻量 Vue Admin 基础设施
  tagline: 开箱可用的布局权限、Schema 表单表格、图标图表、DataV 与驾驶舱编排 · 业务协议留在应用层
  image:
    src: /logo.svg
    alt: Luma
  actions:
    - theme: brand
      text: 快速开始 →
      link: /guide/introduction/quick-start
    - theme: alt
      text: 包使用说明
      link: /packages/
    - theme: alt
      text: 组件文档
      link: /components/introduction
    - theme: alt
      text: GitHub
      link: https://github.com/example/luma

features:
  - icon: 🚀
    title: 最新技术栈
    details: Vue 3、TypeScript、Vite、Element Plus、Pinia、Vue Router。pnpm monorepo 工程化，Changesets 发布。
    link: /guide/introduction/luma
    linkText: 了解 Luma
  - icon: 📦
    title: 按职责拆包
    details: core / icons / charts / datav / cockpit / vite 等独立包，按需安装，边界清晰，可发布 npm。
    link: /packages/
    linkText: 包使用
  - icon: 🎨
    title: 主题与布局
    details: 明暗/系统主题、全局字号、侧栏顶栏混合布局、标签工作流与偏好持久化。
    link: /guide/in-depth/theme
    linkText: 主题文档
  - icon: 🔐
    title: 权限与路由
    details: 静态与远程菜单统一运行时、权限过滤、动态路由、403/404 与指令级控制。
    link: /guide/in-depth/access
    linkText: 权限文档
  - icon: 🧩
    title: Schema 表单表格
    details: LumaSchemaForm / SchemaTable / CrudTable，字典联动、列设置、查询区自适应列数。
    link: /components/form/luma-schema-form
    linkText: 组件文档
  - icon: 📺
    title: 驾驶舱与 DataV
    details: 通用布局编排 + Designer + 消息总线；38 个 DataV 组件双 API 重构。
    link: /packages/cockpit
    linkText: 驾驶舱包
  - icon: ⚡
    title: Vite 工具链
    details: 组件 resolver、工作区 source/dist alias，monorepo 开发免预构建。
    link: /packages/vite
    linkText: '@luma/vite'
  - icon: 🧱
    title: 脚手架
    details: create-luma-admin 一键生成通过公开包入口消费的后台基座。
    link: /packages/create-luma-admin
    linkText: create-luma-admin
---

## 快速安装

::: code-group

```bash [发布后]
pnpm add @luma/core @luma/icons @luma/icons-vue element-plus vue vue-router pinia
```

```bash [本地 monorepo]
# 在 apps 或外部项目 package.json
"@luma/core": "workspace:*"
# 或
pnpm add @luma/core@file:../luma/packages/core
```

```bash [脚手架]
pnpm create luma-admin my-admin
cd my-admin && pnpm install && pnpm dev
```

:::

## 包地址占位

| 包 | 文档 | 本地路径 | 正式地址（上线后） |
| --- | --- | --- | --- |
| `@luma/core` | [/packages/core](/packages/core) | `packages/core` | `https://www.npmjs.com/package/@luma/core` |
| `@luma/icons` | [/packages/icons](/packages/icons) | `packages/icons` | `https://www.npmjs.com/package/@luma/icons` |
| `@luma/icons-vue` | [/packages/icons-vue](/packages/icons-vue) | `packages/icons-vue` | `https://www.npmjs.com/package/@luma/icons-vue` |
| `@luma/charts` | [/packages/charts](/packages/charts) | `packages/charts` | `https://www.npmjs.com/package/@luma/charts` |
| `@luma/datav` | [/packages/datav](/packages/datav) | `packages/datav` | `https://www.npmjs.com/package/@luma/datav` |
| `@luma/cockpit` | [/packages/cockpit](/packages/cockpit) | `packages/cockpit` | `https://www.npmjs.com/package/@luma/cockpit` |
| `@luma/vite` | [/packages/vite](/packages/vite) | `packages/vite` | `https://www.npmjs.com/package/@luma/vite` |
| `@luma/vben-compat` | [/packages/vben-compat](/packages/vben-compat) | `packages/vben-compat` | `https://www.npmjs.com/package/@luma/vben-compat` |
| `create-luma-admin` | [/packages/create-luma-admin](/packages/create-luma-admin) | `packages/create-luma-admin` | `https://www.npmjs.com/package/create-luma-admin` |

> 演示与 npm 外链当前指向本地占位，部署时通过环境变量替换，见 [安装与包地址](/guide/essentials/installation)。
