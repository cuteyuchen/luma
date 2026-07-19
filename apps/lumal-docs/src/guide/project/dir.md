# 目录说明

```text
lumal/
├── apps/
│   ├── lumal-admin/          # Admin 集成与验收
│   ├── lumal-cockpit/        # 驾驶舱示例
│   ├── lumal-datav-guide/    # DataV 指南
│   ├── lumal-docs/           # VitePress 文档站（本站）
│   ├── lumal-mock-api/       # Mock 服务
│   └── vben-compat-demo/
├── packages/
│   ├── core/
│   ├── icons/
│   ├── icons-vue/
│   ├── charts/
│   ├── datav/
│   ├── cockpit/
│   ├── vite/
│   ├── vben-compat/
│   └── create-lumal-admin/
├── docs/                    # 仓库内 Markdown 源（与文档站 reference 同步维护）
├── scripts/                 # 发布与边界检查脚本
└── package.json
```

## 文档站结构

```text
apps/lumal-docs/
├── package.json
├── src/
│   ├── .vitepress/          # 配置与主题
│   ├── guide/               # 指南
│   ├── packages/            # 包使用
│   ├── components/          # 组件文档
│   ├── reference/           # 长文参考
│   ├── public/
│   └── index.md             # 首页
└── dist/                    # 构建产物
```
