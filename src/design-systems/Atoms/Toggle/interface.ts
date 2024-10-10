export interface ToggleProps {
  className?: string
  disabled?: boolean
  defaultCheck?: boolean
  label?: string
  onChange?: (value: boolean) => void
}
