# 字典

## 安装上下文

```ts
createLumaAdmin({
  dictionary: {
    fetcher: async (dictionary) => {
      const res = await api.getDict(dictionary)
      return { items: res.items }
    },
  },
})
```

标准项：`label`、`value`、`color?`、`disabled?`、`children?`。

## 在 Schema 中使用

```ts
{ field: 'status', label: '状态', dictionary: 'status' }
```

- 存在 `dictionary` / `dictType` 时优先用字典结果
- 表格字典带 `color` 时渲染「色点 + 文本」，颜色不作为唯一信息

## 关闭字典

```ts
createLumaAdmin({ dictionary: false })
```
