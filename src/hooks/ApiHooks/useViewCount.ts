import { useMutation } from '@tanstack/react-query'

import { ViewCountQuery } from '@/api-services/interfaces/home'
import ViewCountService from '@/api-services/ViewCountService'
export const useViewCount = () => {
  const {
    isPending: isLoadingPutOncSale,
    data: viewCountResponse,
    mutateAsync: viewCountMutateAsync,
    mutate: viewCountMutate,
    reset: resetViewCount,
  } = useMutation({
    mutationFn: (payload: ViewCountQuery) => ViewCountService.viewCount(payload),
  })

  return {
    viewCountMutateAsync,
    viewCountResponse,
    isLoadingPutOncSale,
    viewCountMutate,
    resetViewCount,
  }
}
