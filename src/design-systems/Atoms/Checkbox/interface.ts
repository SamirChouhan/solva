import { Modify } from '@/interfaces'

export type CheckboxProps = Modify<
  React.HTMLProps<HTMLInputElement>,
  {
    className?: string
    value?: boolean
    checked?: boolean
    label?: string
    icon?: React.ReactElement
    onChange?: (checked: boolean, label: string) => void
  }
>
