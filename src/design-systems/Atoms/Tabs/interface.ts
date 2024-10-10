import React, { SetStateAction } from 'react'

export type Tab = {
  label: string | React.ReactNode
  value: string
  labelType?: string
  hoverLabel?: string
}

export interface DefaultTabProps {
  className?: string
  tabs: Tab[]
  defaultTab: string
  active?: string
  setActive?: React.Dispatch<SetStateAction<string>>
  tabItemWrp?: number
  tabItemClass?: string
  baseRoute: string
  isBgTabs?: boolean
}
