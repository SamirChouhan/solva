interface ProfileNftQuery {
  type: string
}
interface ProfileDataQuery {
  user_address: `0x${string}` | undefined
  page_size?: number
  page_number?: number
}

interface GenerateTabDataQuery {
  user_id: string
  page: number
  page_size: number
}

interface MintedAndFavoriteTabDataQuery {
  wallet_address: string
  page_number: number
  page_size: number
}

interface GenerateTabDataResponse {
  data: searchData[]
  message: string
  status: boolean
}

interface UserDataResponse {
  code: number
  data: UserType
  message: string
  status: boolean
}

type UserData = {
  attachmentUrl?: string
  name?: string
  email?: string
  bio?: string
  portfolio?: string
  twitter_url?: string
  discord_url?: string
  instagram_url?: string
  [key: string]: string
}

type LikeDataMutationType = {
  collectible_id: string | undefined
}

type GetListingData = {
  wallet_address: string
  page_number: number
  page_size: number
  on_sale?: string
}

type UserPlanHistoryQuery = {
  type: string
  page_number: number
  page_size: number
}

type ListingDataResponse = {
  data: {
    collectible_type: string
    description: string
    on_sale: boolean
    preview_url: string
    s3_url: string
    title: string
    _id: string
  }[]
  message: string
  status: boolean
}

interface MintedTabDataResponse {
  code: number
  data: any
  message: string
  status: boolean
}

type TabDataType = MintedTabDataResponse | GenerateTabDataResponse

interface UserPlanHistoryResponse {
  data: {
    createdOn: string
    currency: string
    id: string
    paymentInitiateId: string
    paymentIntent: string
    paymentMode: string
    paymentStatus: string
    planId: {
      id: string
      planName: 'standard'
      quality: 'HD'
      resolution: ['1024x1024']
      bundleSize: 25
    }
    price: {
      numberDecimal: number
    }
    token: number
    updatedTime: string
    userId: string
    chainTransactionHash: string
    v: number
    event?: string
    imageUrl: string
    amount: string
    item: string
    quantity: number
    from: AddressString
    to: AddressString
    date: any
  }[]
}

interface PaymentResponseForToken {
  data: {
    createdOn: string
    currency: string
    paymentMode: string
    paymentStatus: string
    planId: string
    price: { $numberDecimal: string } // This should be clarified based on the expected structure
    token: number
    updatedTime: string
    userId: string
    id: string
  }
}
