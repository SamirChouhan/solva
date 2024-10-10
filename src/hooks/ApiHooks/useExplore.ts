import { useInfiniteQuery } from '@tanstack/react-query'
import { boolean } from 'yup'

import { ExploreService } from '@/api-services'
import { PAGE_SIZE_EXPLORE, removeEmptyKey } from '@/utils'
import { ExploreType } from '@/api-services/interfaces/auth'

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const useExplore = (
  wallet_address: `0x${string}` | undefined,
  sort: string,
  page_size: number,
  page_number: number,
  sale_type: string,
  network_id: string,
  sale_only: boolean,
  collection_address?: string,
  search?: string
) => {
  const {
    data: ExploreData,
    isFetching: ExploreIsFetching,
    isLoading: ExploreIsLoading,
    fetchNextPage: exploreFetchNextPage,
    hasNextPage: exploreHasNextPage,
    isFetchingNextPage: exploreIsFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['sort', sort, sale_type, network_id, collection_address, page_size, search],
    queryFn: async ({ pageParam }) => {
      return ExploreService.getExplore(
        removeEmptyKey({
          wallet_address,
          sort: sort,
          page_size: page_size || PAGE_SIZE_EXPLORE,
          page_number: pageParam,
          sale_type,
          network_id,
          sale_only,
          collection_address,
          search,
        }) as ExploreType
      )
    },
    refetchOnWindowFocus: false,
    initialPageParam: page_number,
    enabled: !!sort,
    select: res => res.pages,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.data === null || lastPage?.data?.length < 3) {
        return undefined
      }
      return allPages.length + 1
    },
  })
  return {
    ExploreData,
    ExploreIsFetching,
    ExploreIsLoading,
    exploreFetchNextPage,
    exploreHasNextPage,
    exploreIsFetchingNextPage,
  }
}
