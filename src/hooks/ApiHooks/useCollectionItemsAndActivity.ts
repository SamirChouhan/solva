import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import CollectionService from '@/api-services/CollectionService'
import { removeEmptyKey } from '@/utils'
import { CollectionItemAndActivityQuery } from '@/api-services/interfaces/collection'

export const useCollectionItemsAndActivity = (
  collection_address: string,
  type: string | number,
  network_type: string
) => {
  return useInfiniteQuery({
    queryKey: ['collectionItemsAndActivity', type, network_type],
    queryFn: ({ pageParam }) =>
      CollectionService.getCollectionActivityAndItems(
        removeEmptyKey({
          page_number: pageParam,
          page_size: 10,
          collection_address,
          type,
        }) as CollectionItemAndActivityQuery
      ),
    initialPageParam: 1,
    select: res => res.pages.map(page => page.data).flat(),
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
}
