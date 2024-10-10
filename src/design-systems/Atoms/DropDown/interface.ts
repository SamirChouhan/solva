export interface Option {
  name: string
  value: string | number
}
export interface DropDownProps {
  data: Option[]
  defaultValue: Option
  onChange: (value: unknown) => void
  className?: string
  isImage?: boolean
}
