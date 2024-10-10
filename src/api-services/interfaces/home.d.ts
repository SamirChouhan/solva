interface CollectionTableListQuery {
  trending: string
  blockchainId: string
  time: string
}

interface NFTListQuery extends WithPaginationRequest {
  wallet_address?: string
  network_id?: MMNetworks
  type?: string
  redeemable?: boolean
}

interface NFTAssetObject {
  id?: number
  image?: string | StaticImageData | ArrayBuffer | null | undefined
  heading?: string
  subHeading?: string
}

export interface NFTListResponse {
  code: number
  data: NFTAssetObject[]
  message: string
  status: boolean
}

interface IpfsData {
  id: string
  ipfsExternalUrl: string
  ipfsHash: string
}
export interface PutOnSaleResponse {
  code: number
  data: IpfsData
  message: string
  status: boolean
}

export interface UpdateCollectionAddressResponse {
  code: number
  data: IpfsData
  message: string
  status: boolean
}

export interface CreateCollectionResponse {
  code: number
  data: IpfsData
  message: string
  status: boolean
}

export interface ViewCountResponse {
  code: number
  data: IpfsData
  message: string
  status: boolean
}

export interface SaveEventNftResponse {
  code: number
  data: IpfsData
  message: string
  status: boolean
}

export interface ExampleListResponse {
  data: { createdOn: string; id: string; imageUrl: string; prompt: string; updatedTime: string; userId: string }[]
}
export interface SubscribePlanResponse {
  url: string
}
export interface GeneratedNFTListResponse {
  status: boolean
  message: string
  code: number
  data: GeneratedNFT[]
}

export interface GeneratedNFT {
  imageUrl: string
  id: number | string
}

export interface PlanListResponse {
  code: number
  data: Plan[]
  message: string
  status: boolean
}

export interface Plan {
  id: string
  planName: string
  priceMonthly: number
  priceYearly: number
  tokenMonthly: number
  tokenYearly: number
  description: string
  features: string[]
  planType: string
  isDelete: boolean
  version: number
  commissionPerBundleSolav: number
  tokenPrice: number
  usdPrice: number
  pricePerImageSolav: {
    $numberDecimal: string
  }
  // Added new fields need to remove above field
  bundleSize: number
  commissionPerBundle: number
  planName: string
  pricePerImage: number
  quality: string
  resolution: string[]
}

interface SubscribePlanQuery {
  planName: string
  planId: string
  description: string
  userId: string
  method: 'token' | 'currency'
}

export interface EmailSubscribeResponse {
  code: number
  data: string
  message: string
  status: boolean
}
export interface EmailPayload {
  email: string
}

export interface CustomField {
  key: string
  value: string
}

export interface CreateNftQuery {
  title: string
  description: string
  network_id: string
  collection_id: string
  customFields?: string
  imageUrl: string
  generatedImageId: string
  isShowPromptPublicly: boolean
}
export interface OnSaleQuery {
  _id?: string
  auctionType: string
  amount: string
  startingTime?: number
  closingTime?: number
  nonce: string
  signature: string
  erc20_address: string
  connectedNetworkId: string
  tokenId?: string
}

interface CustomCollectionListData {
  _id: string
  banner_image: string
  collection_address: string
  displayName: string
  image: string
  network_id: string
  order: string
}
export interface CustomCollectionListResponse {
  code: number
  data: CustomCollectionData
  message: string
  status: boolean
}
export interface OnCreateCollectionQuery {
  _id?: string
  displayName: string
  network_id: string
  description: string
  banner_image: File | null
  image: File | null
  custom_url: string
}
export interface OnUpdateCollectionAddressQuery {
  _id?: string
  network_id: string
  transaction_hash: string
}

export interface ViewCountQuery {
  _id?: string
}

interface SaveSolavQuery {
  transaction_hash: string
  network_id: 1 | 2
  contract_address: string
  payment_id: string
  plan_id: string
  user_id: string
}

// interface GetPlatformFeeInterface {
//   netwotk_id: string

// }
interface GetPlatformFee {
  _id: string
  network_id: string
  platform_fee: number
}

interface GetPlatfromFeeResponse {
  data: GetPlatformFee
  code: number
  message: string
  status: boolean
}
