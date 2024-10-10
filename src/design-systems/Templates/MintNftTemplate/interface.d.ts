declare type BigNumber = import('ethers').BigNumber
declare type BigNumberish = import('ethers').BigNumberish
declare type BytesLike = import('ethers').BytesLike

type AddressString = `0x${string}`

export interface ListingSignPayload {
  seller: AddressString
  contractAddress: AddressString
  royaltyFee: BigNumber
  royaltyReceiver: AddressString
  paymentToken: AddressString
  basePrice: BigNumber
  listingTime: BigNumber
  expirationTime: BigNumber
  nonce: BigNumber
  tokenId: BigNumber
  orderType: uint8
  uri: string
  objId: string
  supply: uint256
  signature?: AddressString
  value: uint256
  nftType: uint8
}

export interface FormikInitialValues {
  title: string
  description: string
  royalties: string
  collection: string
  auctionType: string
  agreement: boolean
  fields: { name: string; value: string }[]
  image: string
  amount: string
  network_id: string
  startingTime: string
  closingTime: number
  isShowPromptPublicly: boolean
  generatedImageId: string
}
