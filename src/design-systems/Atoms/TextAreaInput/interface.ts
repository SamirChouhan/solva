import { Modify } from '@/interfaces'

export type TextAreaInputProps = Modify<
  React.HTMLProps<HTMLTextAreaElement>,
  {
    label?: string
    value?: string
    className?: string
    error?: string
    innerClassName?: string
  }
>
