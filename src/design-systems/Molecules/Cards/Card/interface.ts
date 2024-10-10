import { StaticImageData } from 'next/image'

export type BorderRadiusVariant = 'all' | 'top' | 'bottom' | 'none'
export type TransformVariant = 'x-direction' | 'y-direction' | 'z-direction' | undefined

export interface CardProps {
  alt: string
  children?: React.ReactNode
  className?: string
  fileClassName?: string
  src: string | StaticImageData
  variant?: BorderRadiusVariant
  notification?: React.ReactNode
  direction?: TransformVariant
  onClick?: (nft: string | StaticImageData) => void
  // href?: string
}
