type AddressString = `0x${string}`

type AnyFunction = (...args: any[]) => any

type AnyObject<T = any> = Record<string, T>
type Modify<T, R extends PartialAny<T>> = Omit<T, keyof R> & R
type WithPaginationQuery = {
  pageNumber: number
  pageSize: number
}

type WithPaginationRequest = {
  page_number: number
  page_size: number
}
type ExploreFilters = {
  categoryId: string
  blockchainId?: string
  trending?: string | boolean
}

export interface CheckIconProps extends IconProps {
  border?: string
  check?: string
}
interface ExploreBlock {
  id: string
  name: string
  symbol?: string
  v?: number
  slug?: string
  imageUrl?: string
  greyImageUrl?: string
}
export interface IconProps {
  className?: string
  width?: string | number
  height?: string | number
  fill?: string
  stroke?: string
  id?: string
  rectFill?: string
}

type AIModalsValue = 'realistic'
type AIModalsName = 'Realistic'

export interface AIModals {
  name: AIModalsName
  value: AIModals
}
