import { searchData } from '@/api-services/interfaces/auth'

export interface NftCardListProps {
  data: searchData[] | undefined
  isLoading: boolean
  tab: string
  isFetching?: boolean
}
