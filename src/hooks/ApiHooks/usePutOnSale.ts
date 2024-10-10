import { useMutation } from '@tanstack/react-query'

import { OnSaleQuery } from '@/api-services/interfaces/home'
import { PutOnSaleService } from '@/api-services'

export const usePutOnSale = () => {
  const {
    isPending: isLoadingPutOncSale,
    data: putOncSaleResponse,
    mutateAsync: putOncSaleMutateAsync,
    mutate: putOncSaleMutate,
    reset: resetPutOncSale,
  } = useMutation({
    mutationFn: (payload: OnSaleQuery) => PutOnSaleService.putOnsale(payload),
  })

  return {
    putOncSaleMutateAsync,
    putOncSaleResponse,
    isLoadingPutOncSale,
    putOncSaleMutate,
    resetPutOncSale,
  }
}
