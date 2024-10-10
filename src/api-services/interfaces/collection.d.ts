import { ItemActivity } from './item-details'

export type CollectionQuery = {
  collection_address: string
}

export type CollectionItemAndActivityQuery = {
  collection_address: `0x${string}` | string
  page_size: number
  page_number: number
  type: string | number
}

export interface CollectionInfo {
  id: string
  displayName: string
  description: string
  walletAddress: string
  collectibleType: string
  order: string
  collectionAbiPath: string
  networkId: string
  image: string | null
  bannerImage: string | null
  is_active: boolean
  collectionStatus: string
  customUrl: string
  createdOn: string
  __v: number
  collectionAddress: string
  transactionHash: string
  royalties: number
  ownerVerified: boolean
  totalView: number
}

export interface CollectionDetails {
  data: { items: number; owners: number; floorPrice: number; totalVolume: number; collectionsInfo: CollectionInfo }
  status: boolean
}

export interface CollectionItemAndActivity {
  data: ItemActivity[]
}
