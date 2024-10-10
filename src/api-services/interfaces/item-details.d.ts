interface GetItemDetailInterface {
  collectible_id: string
}

interface ItemActivity {
  collection_address: string
  token_id: string | null
  seller: string
  auctionType: string
  amount: string
  time: string
  ERC20Address: string
  usd_amount: number
  isDynamicPricing: boolean
  dynamicPrice: number
  _id: string
  type: string
  name: string | null
  image: string
  buyer: string
  bidder: string
  from: string
  to: string
  network_id: string
  event: string
  item: string
}

interface ItemActivityResponse {
  data: ItemActivity[]
  code: number
  message: string
  status: boolean
}

//

interface CustomField {
  key: string
  value: string
  _id: string
}

interface AuctionDetails {
  _id: string
  collection_address: string
  token_id: string
  contract_address: string
  auctionType: string
  highestBidder: string
  lastOwner: string
  buyer: string
  initialClosingTime: string
  paymentToken: string
  buyPrice: number
  startingTime: string
  closingTime: string
  nonce: string
  currentBid: string
  erc20Token: string
  orderType: number
  _id: string
  supply: number
  value: number
  signature: string
  startingPrice: string
}

interface CollectionObj {
  _id: string
  collection_address: string
  royalties: number
  collectible_type: string
}

interface OwnerObj {
  wallet_address: string
  image: string
  name: string
}

interface userObj {
  wallet_address: string
  image: string
  name: string
}

interface ItemDetails {
  _id: string
  network_id: string
  file: string
  collection_address: string
  title: string
  description: string
  ipfs_hash: string
  collectible_type: string
  customFields: CustomField[]
  view_count: string
  collectionObj: CollectionObj
  auctionDetails: AuctionDetails
  eth_price: string
  total_like: number
  is_like: boolean
  collectible_owner: string
  nft_type: string
  royalties: string
  ownerObj: OwnerObj
  userObj: userObj
  on_sale: boolean
  wallet: string
  is_approve: boolean
  is_hide: boolean
  token_id: string
  last_price: string
  history: any
  isShowPromptPublicly: boolean
  generatedImagePrompt: string
}

interface ItemDetailsResponse {
  data: ItemDetails
  code: number
  message: string
  status: boolean
}

export interface OnSaveEventNftQuery {
  transaction_hash: string
  contract_address: string
  network_id: string
}

export interface OnBidNftQuery {
  transaction_hash: string
  contract_address: string
  network_id: string
}

export interface SelectedToken {
  address: string
  title: string
}
