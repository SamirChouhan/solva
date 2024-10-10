import { useMutation } from '@tanstack/react-query'

import GetCustomCollectionListService from '@/api-services/GetCustomCollectionListService'
export const useGetCustomCollectionList = () => {
  const {
    isPending: isLoadingGetCustomCollectionList,
    data: getCustomCollectionListResponse,
    mutateAsync: getCustomCollectionListMutateAsync,
    mutate: getCustomCollectionListMutate,
    reset: resetGetCustomCollectionList,
  } = useMutation({
    mutationFn: (query: string) => GetCustomCollectionListService.getCustomcollectionList(query),
  })

  return {
    getCustomCollectionListMutateAsync,
    getCustomCollectionListResponse,
    isLoadingGetCustomCollectionList,
    getCustomCollectionListMutate,
    resetGetCustomCollectionList,
  }
}
