# 包边界与规范

完整条文见 [包边界](/reference/package-boundaries)。消费方摘要：

## 依赖方向

- icons 零运行时依赖；icons-vue 不依赖 core
- core 不依赖 charts / datav / cockpit / vben-compat
- charts / datav 独立；cockpit 可依赖 core
- 业务代码不进 packages

## 检查

```bash
pnpm release:boundaries
pnpm release:artifacts
```

## 代码规范

- Conventional Commit：`<type>(<scope>): <中文动宾>`
- 不自动推送
- 不同 type 的修改拆分提交
