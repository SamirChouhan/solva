export type TimerSize = 'extra small' | 'small' | 'medium' | 'large'

export interface TimerProps {
  size?: TimerSize
  status?: string
  endTime?: Date
  updateStatus?: (status: string) => void
}

export interface RendereProps {
  days?: number
  hours?: number
  minutes?: number
  seconds?: number
  completed?: boolean
}
