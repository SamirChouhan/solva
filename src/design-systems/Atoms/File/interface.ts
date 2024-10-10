import { StaticImageData } from 'next/image'

export interface FileProps {
  alt: string
  src: string | StaticImageData
  type: string
  className?: string
  isLoading?: boolean
  width?: number
  height?: number
  styles?: string
  onCLick?: (src: string | StaticImageData) => void
}
