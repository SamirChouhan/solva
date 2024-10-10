import { StaticImageData } from 'next/image'

import { UserType } from '@/context/UserContext/interface'

export interface NonceType {
  wallet_address: string
  network_id: string
}

export interface NonceResponse {
  status: boolean
  message: string
  code: number
  data: string
}

export interface SignatureType {
  nonce: string
  signature: string
  network_id: string
  wallet_type: string
}

export interface SignUserType {
  coverBackgroundPosition: string
  created_on: string
  deviceTokens: []
  image: string
  isAgreementSigned: boolean
  isBlock: boolean
  isLlcAdmin: boolean
  isPresaleAdmin: boolean
  isStakeAdmin: boolean
  isSuperAdmin: boolean
  isWhiteListedSeller: boolean
  lastLoginTime: string
  network_id: string
  nonce: string
  original_image: string
  role: string
  showSpaceHomePage: boolean
  wallet_address: string
  _id: string
}

export interface SignatureData {
  token: string
  user: UserType
}

export interface SignatureResponse {
  status: boolean
  message: string
  code: number
  data: SignatureData
}

export interface SearchType {
  search: string
}

export interface ExploreType {
  wallet_address: `0x${string}` | undefined
  sort: string
  page_size: number
  page_number: number
  sale_type: string
  network_id: string
  sale_only: boolean
  collection_address?: string
  search?: string
}

interface AuctionObject {
  id: string
  collectionAddress: AddressString
  tokenId: string | number
  networkId: ClubRareNetworks
  contractAddress: AddressString
  nonce: string | number
  collectibleId: string
  signature: AddressString
  lastOwner: AddressString
  bidTime: string | UTCString
  currentBid: string | number
  highestBidder: AddressString
  auctionType: AuctionTypes
  startingPrice: string | number
  buyPrice: string | number
  buyer: AddressString
  collector: AddressString
  startingTime: string | UTCString
  closingTime: string | UTCString
  initialClosingTime: string | UTCString
  isTokenGated: boolean
  tokenGateAddress: AddressString
  erc20Token: AddressString
  isActive: boolean
  memberShipTiers?: MemberShipTiers
  isDynamicPricing?: boolean
  dynamicPrice?: number
}

export interface searchData {
  id: string
  collection_address: string
  network_id: string
  is_approve: boolean
  price: string
  image: string
  file: string
  s3_url: string | null
  file_content_type: string
  redeemable: boolean
  redeem_verified: boolean
  redeem_type: number
  nft_type: string
  contract_type: string
  collectible_owner: string
  title: string
  description: string
  royalties: number
  usd_amount: number
  onSale: boolean
  is_hide: boolean
  created_by: string
  isLike: boolean
  is_active: boolean
  isWeb2item: boolean
  created_on: string
  userObj: {
    name: string | null
    image: string
    wallet_address: string
  }
  total_like: number
  isOnSaleSort: number
  eth_price: number
  last_erc20_address: string
  auctionDetails?: AuctionObject
  previewUrl: string | StaticImageData
  collectibleOwner: string
  history: any
  lastPrice?: string
  lastErc20Address: string
  usdAmount?: number
  isWeb2item?: boolean
  networkId: string
  isShowPromptPublicly: boolean
  isMinted?: boolean
  generatedImagePrompt?: string
}

export interface SearchResponse {
  data: searchData[]
}
