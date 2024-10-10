import moment from 'moment'
import { BigNumberish, ethers } from 'ethers'
import { writeContract, waitForTransactionReceipt } from '@wagmi/core'
import { Abi } from 'viem'
import { type WriteContractErrorType } from '@wagmi/core'

import { AUCTION_TYPES, NULL_TOKEN_ADDRESS, getSolavTokenAddress } from '.'

import { AddressString, AnyObject } from '@/interfaces'
import { searchData } from '@/api-services/interfaces/auth'
import { BigNumber } from '@/design-systems/Templates/MintNftTemplate/interface'
import { NFTPriceObject } from '@/design-systems/Molecules/Cards/NftCard/interface'
import { config } from '@/context/wagmiContext/config'
import { ItemActivity } from '@/api-services/interfaces/item-details'
import { UserType } from '@/context/UserContext/interface'
import { ItemDetails } from '@/api-services/interfaces/item-details'

export const getQueries = (obj: AnyObject): string => {
  return Object.keys(obj ?? {})
    .map(item => `${item}=${obj[item]}`)
    .join('&')
}

export const parseData = (data: string) => {
  return JSON.parse(data)
}

const WEI_TO_ETHER = 1e18

export const getExtentionOfImage = (url: string) => {
  if (typeof url === 'string') return url.split('.').pop()
  return ''
}
export const formatLike = (likes: number) => {
  const billion = 1000000000
  const million = 1000000
  const thousand = 1000

  if (likes >= billion) {
    return (likes / billion).toFixed(1) + 'B'
  } else if (likes >= million) {
    return (likes / million).toFixed(1) + 'M'
  } else if (likes >= thousand) {
    return (likes / thousand).toFixed(1) + 'K'
  }

  return likes.toString()
}
export const formatAddress = (address: string) =>
  `${address?.substring(0, 6)}...${address?.substring(address?.length - 4)}`

export const formatTime = (time: number) => {
  return moment(time).format('YYYY-MM-DD h:mm:ss a')
}
export const compareStringsInsentively = (str1: string, str2: string): boolean =>
  str1?.toLowerCase() === str2?.toLowerCase()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function filterEmptyValues<T extends Record<string, any>>(inputObj: T): T {
  const result: Partial<T> = {}

  for (const key in inputObj) {
    if (Object.prototype.hasOwnProperty.call(inputObj, key)) {
      const value = inputObj[key]

      // Customize this condition to check for your definition of empty
      if (value !== undefined && value !== null && value !== '') {
        result[key] = value
      }
    }
  }

  return result as T
}
export function getTimeFromTimestamp(timestamp: string) {
  const dateTime = new Date(timestamp)
  const time = dateTime.toTimeString().slice(0, 8)
  return time
}

export function getDateFromTimestamp(datestamp: string) {
  const dateTime = new Date(datestamp)
  const date = dateTime.toDateString()
  return date
}
export function getCurrentDate() {
  const now = new Date()
  return now.toDateString()
}

// Handles both modern Clipboard API and legacy fallback
export function copyToClipboard(text: string): Promise<boolean> {
  if (!navigator || !navigator.clipboard) {
    return fallbackCopyToClipboard(text)
  }

  return navigator.clipboard
    .writeText(text)
    .then(() => {
      return true // Success
    })
    .catch(error => {
      console.error('Failed to copy using Clipboard API:', error)
      return fallbackCopyToClipboard(text) // Fallback if fails
    })
}

// Fallback for older browsers (less secure)
function fallbackCopyToClipboard(text: string): Promise<boolean> {
  const textArea = document.createElement('textarea')
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.select()

  let successful = false
  try {
    successful = document.execCommand('copy')
  } catch (err) {
    console.error('Failed to copy using document.execCommand:', err)
  }

  document.body.removeChild(textArea)
  return Promise.resolve(successful)
}

export function getCurrentYear() {
  return new Date().getFullYear()
}

export const parseUnits = (amount: string) => {
  return ethers.parseUnits(amount.toString(), 'mwei').toString()
}

export const formatDateTime = (date: Date): string => {
  const padZero = (num: number) => (num < 10 ? `0${num}` : num)
  const year = date.getFullYear()
  const month = padZero(date.getMonth() + 1) // Months are zero-indexed
  const day = padZero(date.getDate())
  const hours = padZero(date.getHours())
  const minutes = padZero(date.getMinutes())
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export const getSaleStatus = (asset: searchData | undefined) => {
  if (asset?.onSale && asset?.auctionDetails) {
    if (asset?.auctionDetails?.auctionType === AUCTION_TYPES.FIXED) {
      return 'listed'
    } else if (
      asset?.auctionDetails?.auctionType === AUCTION_TYPES.AUCTION &&
      asset?.auctionDetails?.closingTime &&
      new Date(asset?.auctionDetails?.closingTime) >= new Date()
    ) {
      return new Date(asset?.auctionDetails?.startingTime) > new Date() ? 'future' : 'listed'
    } else if (
      asset?.auctionDetails?.auctionType === AUCTION_TYPES.AUCTION &&
      asset?.auctionDetails?.closingTime &&
      new Date(asset?.auctionDetails?.closingTime) <= new Date()
    ) {
      return 'ended'
    }
  } else {
    if (asset?.history?.buy?.length) {
      return 'sold'
    }
  }

  return ''
}

export const getTokenKey = (tokenAddress: string, networkId: string) => {
  const solavToken = getSolavTokenAddress(networkId)
  if (tokenAddress?.toLowerCase() === solavToken) return 'SOLAV'
  else {
    if (networkId === '2') return 'MATIC'
    return 'ETH'
  }
}

export const formatUnits = (amount: string | number | BigNumber | BigNumberish, token: string, toFixed = true) => {
  const toFixVal = token === 'USDT' ? 1 : ['ETH', 'MATIC'].includes(token) ? 6 : 0

  if (toFixed) {
    if (token == 'USDT') {
      return String(Number(ethers.formatUnits(amount.toString(), 'mwei'))?.toFixed(toFixVal) ?? 0)
    } else {
      return String(Number(ethers.formatUnits(amount.toString(), 'ether'))?.toFixed(toFixVal) ?? 0)
    }
  } else {
    if (token == 'USDT') {
      return Number(ethers.formatUnits(amount.toString(), 'mwei'))
    } else {
      return Number(ethers.formatUnits(amount.toString(), 'ether'))
    }
  }
}

export const getNftPrice = (asset: searchData): NFTPriceObject => {
  const nftPrice: NFTPriceObject = {}

  if (!asset) return nftPrice
  nftPrice.isWeb2item = asset?.isWeb2item
  const erc20Address = asset?.auctionDetails?.erc20Token ?? NULL_TOKEN_ADDRESS
  if (asset.onSale && asset.auctionDetails && erc20Address) {
    const token = asset?.isWeb2item ? 'USD' : getTokenKey(erc20Address, asset?.networkId)
    nftPrice.isDynamicPricing = asset.auctionDetails?.isDynamicPricing
    nftPrice.dynamicPrice = asset.auctionDetails?.dynamicPrice
    if (asset.auctionDetails?.buyPrice && asset.auctionDetails?.buyPrice !== '0') {
      nftPrice.label = 'Buy Price'
      nftPrice.token = token
      nftPrice.amount = formatUnits(asset.auctionDetails.buyPrice, token)
    } else if (asset.auctionDetails?.currentBid && asset.auctionDetails?.currentBid !== '0') {
      nftPrice.label = 'Current Bid'
      nftPrice.token = token
      nftPrice.amount = formatUnits(asset.auctionDetails.currentBid, token)
    } else if (asset.auctionDetails?.startingPrice && asset.auctionDetails?.startingPrice !== '0') {
      nftPrice.label = 'Starting Price'
      nftPrice.token = token
      nftPrice.amount = formatUnits(asset.auctionDetails.startingPrice, token)
    }
  } else if (asset.lastPrice && asset.lastPrice !== '0' && (asset.lastErc20Address || asset.isWeb2item)) {
    const token = asset?.isWeb2item ? 'USD' : getTokenKey(asset.lastErc20Address, asset?.networkId)
    nftPrice.label = 'Last Price'
    nftPrice.token = token
    nftPrice.amount = formatUnits(asset.lastPrice, token)
    nftPrice.isDynamicPricing = false
    nftPrice.dynamicPrice = asset.usdAmount
  } else if (asset.history?.buy && asset.history?.buy?.length > 0) {
    nftPrice.isDynamicPricing = false
    nftPrice.dynamicPrice = asset.usdAmount
    const lastBuy = asset.history?.buy[asset.history.buy.length - 1]
    if (lastBuy && lastBuy?.amount && lastBuy?.erc20Address) {
      const token = asset?.isWeb2item ? 'USD' : getTokenKey(lastBuy.erc20Address, asset?.networkId)
      nftPrice.label = 'Last Price'
      nftPrice.token = token
      nftPrice.amount = formatUnits(lastBuy.amount, token)
    }
  }

  return nftPrice
}

export function snakeToCamel<T extends Record<string, any>>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(item => snakeToCamel(item)) as any
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/(_\w)/g, match => match[1].toUpperCase())
      let value: any = (obj as any)[key]
      if (Array.isArray(value) || (value !== null && typeof value === 'object')) {
        value = snakeToCamel(value)
      }
      acc[camelKey as keyof T] = value
      return acc
    }, {} as T)
  }
  return obj
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const handleWriteContractOperation = async (
  functionName: string,
  args: any[],
  address: AddressString,
  abi: readonly unknown[] | Abi,
  chainId: number | undefined
) => {
  try {
    const res = await writeContract(config, {
      address,
      abi,
      functionName,
      args,
    })

    const confirmation = await waitForTransactionReceipt(config, { confirmations: 2, hash: res, chainId })

    if (confirmation.status === 'success') {
      return res
    } else {
      throw new Error(`${functionName} transaction failed`, { cause: confirmation })
    }
  } catch (error) {
    console.error(error)
    throw new Error(`Error in ${functionName} transaction`, { cause: error })
  }
}

export const writeContractTxResponse = async (
  functionName: string,
  args: any[],
  address: AddressString,
  abi: readonly unknown[] | Abi,
  chainId: number | undefined
) => {
  try {
    const res = await writeContract(config, {
      address,
      abi,
      functionName,
      args,
    })

    const confirmation = await waitForTransactionReceipt(config, { confirmations: 2, hash: res, chainId })

    if (confirmation.status === 'success') {
      return confirmation
    } else {
      throw new Error(`${functionName} transaction failed`, { cause: confirmation })
    }
  } catch (error) {
    console.error(error)
    throw new Error(`Error in ${functionName} transaction`, { cause: error })
  }
}

export const getFromAddress = (row: ItemActivity) => {
  if (row.type === 'BID') return row.bidder
  else if (row.type === 'LISTED') return row.seller
  else if (row.type === 'TRANSFER') return row.from
  else if (row.type === 'PURCHASED') return row.seller
  else return ''
}

export const getToAddress = (row: ItemActivity) => {
  if (row.type === 'BID') return ''
  else if (row.type === 'LISTED') return ''
  else if (row.type === 'TRANSFER') return row.to
  else if (row.type === 'PURCHASED') return row.buyer
  else return ''
}

export const getTotalCredit = (data: UserType) => {
  let totalCredit = 0
  if (!data) return 0

  if (!data?.isFreeTierOver) totalCredit += 5 - data?.freeImagesCount

  if (data?.userImagePlan && data.planDetails) {
    totalCredit += data.userImagePlan?.bundleImageSize - data.userImagePlan?.totalGenerated
  }

  return totalCredit
}

export const getItemSaleStatus = (asset: ItemDetails | undefined) => {
  if (asset?.on_sale && asset?.auctionDetails) {
    if (asset?.auctionDetails?.auctionType === AUCTION_TYPES.FIXED) {
      return 'listed'
    } else if (
      asset?.auctionDetails?.auctionType === AUCTION_TYPES.AUCTION &&
      asset?.auctionDetails?.closingTime &&
      new Date(asset?.auctionDetails?.closingTime) >= new Date()
    ) {
      return new Date(asset?.auctionDetails?.startingTime) > new Date() ? 'future' : 'listed'
    } else if (
      asset?.auctionDetails?.auctionType === AUCTION_TYPES.AUCTION &&
      asset?.auctionDetails?.closingTime &&
      new Date(asset?.auctionDetails?.closingTime) <= new Date()
    ) {
      return 'ended'
    }
  } else {
    if (asset?.history?.buy?.length) {
      return 'sold'
    }
  }

  return ''
}

/**
 * Replace all URLs with a tag in given text.
 * @param text - texts with URLs
 * @returns - formatted texts
 */
export const parseAnchorTags = (text: string) => {
  if (!text) {
    return '<a></a>'
  }
  const urlRegex =
    /(((https?:\/\/)|(www\.))[^\s]+)|[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/g
  return text?.replace(urlRegex, function (url: string) {
    let hyperlink: string = url
    if (!hyperlink.match('^https?://')) {
      hyperlink = 'https://' + hyperlink
    }
    return '<a href="' + hyperlink + '" target="_blank" rel="noopener noreferrer">' + url + '</a>'
  })
}

export const convertWeiToEther = (weiValue: string): number => {
  const weiNumber = parseInt(weiValue, 10) // Convert string to number
  return weiNumber / WEI_TO_ETHER
}

type objType = { [key: string]: any }
export const removeEmptyKey = (data: objType): objType => {
  const params = { ...data }
  Object.keys(params).forEach(
    key => (params[key] === undefined || params[key] === '' || params[key] === 0) && delete params[key]
  )
  return params
}
