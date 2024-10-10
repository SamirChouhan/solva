import NextLink from 'next/link'

import Typography from '../Typography'

import { LinkProps } from './interface'
import { getStyles } from './utils'

const Link: React.FC<LinkProps> = ({ className = '', leftIcon, rightIcon, disabled = false, children, ...props }) => {
  const [linkClassName, disabledClassName] = getStyles(className)

  if (disabled)
    return (
      <Typography className={disabledClassName} size="subtitle" variant="condensed">
        {children}
      </Typography>
    )

  return (
    <NextLink className={linkClassName} {...props}>
      {leftIcon && <span>{leftIcon}</span>}
      <Typography className={linkClassName} size="subtitle" variant="condensed">
        {children}
      </Typography>
      {rightIcon && <span>{rightIcon}</span>}
    </NextLink>
  )
}
export default Link
