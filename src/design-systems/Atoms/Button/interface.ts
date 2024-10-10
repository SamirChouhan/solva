import type { PropsWithChildren } from 'react'
import React from 'react'

import { Modify } from '@/interfaces'

export type ButtonSize = 'small' | 'medium' | 'large'

export type ButtonVariant = 'solid' | 'outlined'

export type ButtonColor = 'pink' | 'primary' | 'secondary' | 'green'

export type ButtonElementProps = Modify<
  React.HTMLProps<HTMLButtonElement>,
  {
    type?: 'button' | 'submit' | 'reset' | undefined
    loading?: boolean
    size?: ButtonSize
    variant?: ButtonVariant
    color?: ButtonColor
    fullWidth?: boolean
    className?: string
    icon?: React.ReactNode
    iconPosition?: 'start' | 'end'
  }
>

export interface ButtonProps extends ButtonElementProps, PropsWithChildren {}
