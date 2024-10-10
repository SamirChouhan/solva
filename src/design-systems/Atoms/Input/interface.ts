import { AnyFunction, Modify } from '@/interfaces'

export type InputVariant = 'primary' | 'secondary' | 'fill'

export type InputProps = Modify<
  React.HTMLProps<HTMLInputElement>,
  {
    type?: string
    label?: string | JSX.Element
    placeholder?: string
    value?: string | number
    className?: string
    inWrpClassName?: string
    variant?: InputVariant
    inputClassNames?: string
    error?: string
    inputStyle?: string
    onBlur?: AnyFunction
    onFocus?: AnyFunction
    errorClassName?: string
    inputDirectWrp?: string
  }
>
