export interface IconProps {
  className?: string
  width?: string | number
  height?: string | number
  fill?: string
  stroke?: string
  id?: string
  rectFill?: string
  style?: any
}

export interface CheckIconProps extends IconProps {
  border?: string
  check?: string
}

export interface TokenIconProps extends IconProps {
  isActive?: boolean
}
