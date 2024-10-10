import { CardVariant } from './interface'

export const getImageSize = (variant: CardVariant) => {
  switch (variant) {
    case 'example':
      return ' smd:h-[320px] h-[219px] sm:h-[260px] w-full'
    case 'explore':
      return 'h-[320px] w-full'
    case 'generated':
      return 'smd:h-[219px] h-[220px]  w-full'
    case 'mint preview':
      return 'w-full h-[390.884px]  '
    default:
      return 'w-full h-full'
  }
}
export const getBorderRadius = (variant: CardVariant) => {
  switch (variant) {
    case 'example':
      return 'rounded-xl'
    case 'explore':
      return 'rounded-xl'
    case 'generated':
      return 'rounded-md'
    case 'mint preview':
      return 'rounded-md '
    default:
      return ''
  }
}
export const getCardImageRadius = (variant: CardVariant) => {
  switch (variant) {
    case 'example':
      return 'rounded-xl'
    case 'explore':
      return 'rounded-xl'
    case 'generated':
      return 'rounded-sm'
    case 'mint preview':
      return 'rounded-sm'
    default:
      return ''
  }
}
