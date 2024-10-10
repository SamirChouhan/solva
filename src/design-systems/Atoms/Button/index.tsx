import React from 'react'

import Typography from '../Typography'

import { ButtonProps } from './interface'
import { getButtonBorderStyles, getButtonColors, getButtonSize } from './utils'

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  loading = false,
  disabled = false,
  fullWidth = false,
  size = 'medium',
  color = 'pink',
  className = '',
  children,
  variant = 'solid',
  onClick,
  icon,
  iconPosition = 'end',
  ...props
}) => {
  const classNames = [
    getButtonColors(color, variant),
    getButtonSize(size, loading, fullWidth),
    getButtonBorderStyles(color, variant),
    'flex items-center justify-center gap-3',
    'overflow-hidden',
    ' transition duration-300 ease-out     rounded-3xl  focus:outline-none custom-focus',
    fullWidth && 'w-full',
    disabled ? 'pointer-events-none text-lightGray  ' : 'cursor-pointer',
    className,
  ].join(' ')

  if (loading) disabled = true

  return (
    <button className={`${classNames}`} disabled={disabled} type={type} onClick={onClick} {...props}>
      {iconPosition === 'start' && !loading && <div>{icon}</div>}
      {loading ? (
        <Typography
          className={` flex items-center justify-center text-center dark:text-neutral-800 ${variant === 'outlined' && '!font-semibold'} `}
          size="button"
        >
          Loading...
        </Typography>
      ) : (
        <Typography
          className={`flex items-center justify-center text-center dark:text-neutral-800  ${variant === 'outlined' && '!font-semibold'}`}
          size="button"
        >
          {children}
        </Typography>
      )}
      {iconPosition === 'end' && !loading && icon}
    </button>
  )
}
export default Button
