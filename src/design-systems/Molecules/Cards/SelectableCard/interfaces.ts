import { StaticImageData } from 'next/image'

export interface SelectableCardProps {
  image: string | StaticImageData
  isSelected: boolean
  onClick: () => void
  isOtherSelected: boolean
}
