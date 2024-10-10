import { StaticImageData } from 'next/image'
export interface ImageProps {
  alt: string
  src: StaticImageData | string
  className?: string
  styles?: string
  disabled?: boolean
  width?: number
  height?: number
  onClick?: (src: string | StaticImageData) => void
}
