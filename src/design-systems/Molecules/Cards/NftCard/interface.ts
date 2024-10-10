import { StaticImageData } from 'next/image'

import { AuctionObject } from '@/api-services/interfaces/auth'

export type NFTStatus = 'future' | 'listed' | 'sold' | 'ended' | ''

export interface NFTCardProps {
  src: string | StaticImageData
  className?: string
  heading?: string
  subHeading?: string
  isSelected?: boolean
  variant?: CardVariant
  isOtherSelected?: boolean
  onClick?: () => void
  isMinted?: boolean
  isLike?: boolean
  id?: string
  tab?: string
  price?: NFTPriceObject
  network?: string
  auctionDetails?: AuctionObject
  collectibleOwner?: string
  status?: NFTStatus
  isShowPromptPublicly?: boolean
  generatedImagePrompt?: string
  isLink?: boolean
  saleType?: string
}

export type CardVariant = 'example' | 'generated' | 'explore' | 'mint preview'

export interface NFTPriceObject {
  token?: string
  label?: string
  amount?: string | number
  isDynamicPricing?: boolean
  dynamicPrice?: number
  isWeb2item?: boolean
}
