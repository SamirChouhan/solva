import { BorderRadiusVariant, TransformVariant } from './interface'

export const getBorderRadius = (variant: BorderRadiusVariant): string => {
  const borderRadiusClasses: Record<BorderRadiusVariant, string> = {
    all: 'rounded-sm',
    top: 'rounded-tl-sm rounded-tr-sm',
    bottom: 'rounded-bl-sm rounded-br-sm',
    none: 'rounded-none',
  }

  if (variant in borderRadiusClasses) {
    return borderRadiusClasses[variant]
  } else {
    throw new Error('Invalid Button variant: ' + variant)
  }
}
export const getTransform = (variant: TransformVariant) => {
  switch (variant) {
    case 'x-direction':
      return ' card-shadow'
    case 'y-direction':
      return 'transform card-shadow'
    case 'z-direction':
      return 'transform hover:scale-110 transition-transform duration-300 group-hover:scale-110'
    default:
      return ''
  }
}
export const launchpadNotification = 'right-4 top-4 items-center justify-center rounded-sm'
