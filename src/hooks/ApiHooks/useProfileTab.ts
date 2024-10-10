import { useInfiniteQuery } from '@tanstack/react-query'

import ProfileService from '@/api-services/ProfileService'

export const useProfileTab = (
  tab: string,
  page_size: number,
  page_number: number,
  address: `0x${string}` | undefined,
  userId: string,
  saleType?: string
) => {
  const profileTabQuery = useInfiniteQuery({
    queryKey: ['profile-tab', tab, page_number, page_size, tab === 'generated' ? userId : address, saleType],
    queryFn: ({ pageParam }) => {
      if (tab === 'created') {
        return ProfileService.getMintedTabData({
          wallet_address: address?.toLowerCase() || '',
          page_number: pageParam,
          page_size,
        })
      }
      if (tab === 'favourites') {
        return ProfileService.getFavoriteTabData({
          wallet_address: address || '',
          page_number: pageParam,
          page_size,
        })
      }

      if (tab === 'collected') {
        return ProfileService.getListingList({
          wallet_address: address || '',
          page_number: pageParam,
          page_size,
          on_sale: saleType,
        })
      }

      return ProfileService.getGenerateTabData({ user_id: userId, page: pageParam, page_size })
    },
    initialPageParam: page_number,
    enabled: !!tab && !!address,
    select: res => res.pages,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.data) {
        return undefined
      }
      if (lastPage.data.length < 3) {
        return undefined
      }
      return allPages.length + 1
    },
  })
  return { profileTabQuery }
}
