import type { Component } from 'vue'
import type { CockpitWidgetInstance } from '../types'

/***********************公共 Card 协议*********************/

export interface CockpitCardTab {
  id: string
  title: string
  widget: CockpitWidgetInstance
}

export interface CockpitCardProps {
  title?: string
  widget?: CockpitWidgetInstance
  tabs?: CockpitCardTab[]
  activeTabId?: string
}

export type CockpitCardComponent = Component<CockpitCardProps>
