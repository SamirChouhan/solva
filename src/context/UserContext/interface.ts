export interface SignatureData {
  token: string
  user: UserType
}

export interface SignatureResponse {
  signatureData: SignatureData
  setSignatureData: React.Dispatch<React.SetStateAction<SignatureData>>
  remainingCredit: number
  setRemainingCredit: React.Dispatch<React.SetStateAction<number>>
  setIsLoadUser: React.Dispatch<React.SetStateAction<boolean>>
  isLoadUser: boolean
}

interface PlanDetails {
  id: string
  planName: string
  quality: string
  resolution: string[]
  pricePerImage: number
  bundleSize: number
  commissionPerBundle: number
}

export interface UserType {
  isPrivate: boolean
  created_on: string
  image: string
  isLlcAdmin: boolean
  isStakeAdmin: boolean
  isSuperAdmin: boolean
  network_id: string
  original_image: string
  showSpaceHomePage: boolean
  wallet_address: string
  coverBackgroundPosition: string
  createdOn: string
  deviceTokens: string[]
  freeImagesCount: number
  id: string
  isAgreementSigned: boolean
  isBlock: boolean
  isFreeTierAvail: boolean
  isFreeTierOver: boolean
  isPlanPurchase: boolean
  isPresaleAdmin: boolean
  isWhiteListedSeller: boolean
  lastLoginTime: string
  networkId: string
  nonce: string
  role: string
  walletAddress: string
  userImagePlan: UserImagePlan | null
  name?: string
  email?: string
  bio?: string
  portfolio?: string
  twitterUrl?: string
  discordUrl?: string
  instagramUrl?: string
  planDetails?: PlanDetails
  userImagePlanHistory: {
    createdOn: string
    currency: string
    paymentInitiateId: string
  }[]
}

interface UserImagePlan {
  id: string
  userId: string
  planId: string
  totalGenerated: number
  paymentId?: string
  isActive: boolean
  bundleImageSize: number
  createdOn: string
  updatedTime: string
  __v: number
}
