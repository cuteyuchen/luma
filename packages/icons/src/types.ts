import type { Component } from 'vue'

/***********************图标基础类型*********************/
export type IconKey = string

export type IconSource = 'local-svg' | 'iconify' | 'component'

export interface IconDefinition {
  key: IconKey
  label?: string
  group?: string
  source: IconSource
  svgText?: string
  icon?: string
  component?: Component
}

export interface IconGroupDefinition {
  key: string
  label: string
  order?: number
}

/***********************图标渐变类型*********************/
export interface IconGradientStop {
  offset: string
  color: string
  opacity?: number
}

export interface IconGradientOptions {
  id?: string
  from?: string
  to?: string
  stops?: IconGradientStop[]
  direction?: 'horizontal' | 'vertical'
}
