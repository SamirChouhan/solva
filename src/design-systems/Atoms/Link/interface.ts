import type { PropsWithChildren } from 'react'
import type { LinkProps as NextLinkProps } from 'next/link'

export interface LinkProps
  extends PropsWithChildren,
    NextLinkProps,
    Pick<React.HTMLProps<HTMLAnchorElement>, 'rel' | 'target'> {
  className?: string
  disabled?: boolean
  leftIcon?: React.ReactElement
  rightIcon?: React.ReactElement
}
