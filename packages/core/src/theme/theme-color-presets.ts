/***********************主题色预设*********************/
export interface ThemeColorPreset {
  label: string
  value: string
  /** 自定义色占位项，选中后应展示取色器。 */
  custom?: boolean
}

/**
 * 主题色预设列表。最后一项为自定义占位，业务可按需裁剪或替换。
 * 不绑定任何业务主题，仅提供通用可选色板。
 */
export const themeColorPresets: ThemeColorPreset[] = [
  { label: '默认蓝', value: '#1677ff' },
  { label: '极客蓝', value: '#2f54eb' },
  { label: '拂晓蓝', value: '#1890ff' },
  { label: '薄暮红', value: '#f5222d' },
  { label: '火山橙', value: '#fa541c' },
  { label: '日暮黄', value: '#faad14' },
  { label: '极光绿', value: '#13c2c2' },
  { label: '青柠绿', value: '#52c41a' },
  { label: '酱紫色', value: '#722ed1' },
  { label: '洋红色', value: '#eb2f96' },
  { label: '自定义', value: '__custom__', custom: true },
]
