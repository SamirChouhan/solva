import { AddressString } from '@/interfaces'

export const PAGE_SIZE = 4
export const PAGE_SIZE_EXPLORE = 3
export const parseBoolean = (value?: string) => {
  return value && value.toLowerCase() === 'true'
}
export const IS_PRODUCTION = parseBoolean(process.env.NEXT_PUBLIC_IS_PRODUCTION)

// to do depend on the url
export const BASE_API_ENDPOINT = process.env.NEXT_PUBLIC_BASE_URL

export const PAGE_SCROLL_TRIGGER_DELAY = 250
export const explorePageTabs = [
  {
    label: '  Trending NFTs',
    value: 'trending',
    labelType: 'string',
    hoverLabel: 'Trending NFT',
  },
  {
    label: ' All NFTs',
    value: 'all-nft',
    labelType: 'string',
    hoverLabel: 'All NFTs',
  },
]
export const profilePageTabs = [
  {
    label: 'Generated',
    value: 'generated',
    labelType: 'string',
    hoverLabel: 'Generated',
  },
  {
    label: 'Created',
    value: 'created',
    labelType: 'string',
    hoverLabel: 'Created',
  },
  {
    label: 'Collected',
    value: 'collected',
    labelType: 'string',
    hoverLabel: 'Collected',
  },
  {
    label: 'Favourites',
    value: 'favourites',
    labelType: 'string',
    hoverLabel: 'Favourites',
  },
]
export const itemDetailsTab = [
  {
    label: 'Details',
    value: 'details',
    labelType: 'string',
    hoverLabel: 'Details',
  },
  {
    label: 'Item Activity',
    value: 'item-activity',
    labelType: 'string',
    hoverLabel: 'Item Activity',
  },
]
export const PAYMENT_TOKEN = {
  solavPaymentToken: '0x1A5afC621B9E933EF626B176d4125E45BEE0380B',
  addressZero: '0x0000000000000000000000000000000000000000',
}
export const SETTINGS = {
  name: 'Solav Marketplace',
  version: '1.0.1',
} as const

export const LISTING_SIGN_ABI = [
  {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ],
    Order: [
      { name: 'seller', type: 'address' },
      { name: 'contractAddress', type: 'address' },
      { name: 'royaltyFee', type: 'uint256' },
      { name: 'royaltyReceiver', type: 'address' },
      { name: 'paymentToken', type: 'address' },
      { name: 'basePrice', type: 'uint256' },
      { name: 'listingTime', type: 'uint256' },
      { name: 'expirationTime', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'orderType', type: 'uint256' },
      { name: 'uri', type: 'string' },
      { name: 'objId', type: 'string' },
      { name: 'supply', type: 'number' },
      { name: 'value', type: 'number' },
      { name: 'nftType', type: 'number' },
    ],
  },
] as const

export const NULL_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000'
export const SOLAV_TOKEN_ADDRESS = IS_PRODUCTION
  ? '0xfc5e4ed56153b57aa8ef769eba3e79e58e19be93'
  : '0x1a5afc621b9e933ef626b176d4125e45bee0380b'
export const SOLAV_POLY_TOKEN_ADDRESS = IS_PRODUCTION
  ? '0x31e8cac60330fc9283d8876732c45176f5fb0da1'
  : '0xbbbb450e756bb5918d418913197d6ab4014d62dd'

export enum SOLAV_NETWORKS {
  ETHEREUM = '1',
  POLYGON = '2',
}
export enum ITEM_SALE_STATUS {
  LISTED = 'listed',
  SOLD = 'sold',
  FUTURE = 'future',
  ENDED = 'ended',
}
export const CHAIN_ID = IS_PRODUCTION ? { polygon: 137, etherum: 1 } : { polygon: 80002, etherum: 11155111 }

export const DROPDOWN_OPTIONS_ETH = [
  {
    name: 'ETH',
    value: NULL_TOKEN_ADDRESS as AddressString,
  },
  {
    name: 'SOLAV',
    value: SOLAV_TOKEN_ADDRESS as AddressString,
  },
]
export const DROPDOWN_OPTIONS_POLY = [
  {
    name: 'MATIC',
    value: NULL_TOKEN_ADDRESS as AddressString,
  },
  {
    name: 'SOLAV',
    value: SOLAV_POLY_TOKEN_ADDRESS as AddressString,
  },
]

export enum AUCTION_TYPES {
  FIXED = '1',
  AUCTION = '2',
}

export const TOKEN_URI_PREFIX = 'https://gateway.pinata.cloud/ipfs/'
export const CONTRACT_URI = 'https://ipfs.io/ipfs'

export const convertDate2UTCTimeStamp = (date: Date) => {
  const utc: number = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes()
  )
  return Math.ceil(utc.valueOf() / 1000)
}
