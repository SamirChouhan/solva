import { useQuery } from '@tanstack/react-query'

import CollectionService from '@/api-services/CollectionService'

export const useCollectionDetails = (collectionAddress: string) => {
  return useQuery({
    queryKey: ['collection-details'],
    queryFn: () => CollectionService.getCollectionDetails({ collection_address: collectionAddress }),
  })
}
