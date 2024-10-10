import { useMutation } from '@tanstack/react-query'

import { OnUpdateCollectionAddressQuery } from '@/api-services/interfaces/home'
import UpdateCollectionAddressService from '@/api-services/UpdateCollectionAddressService'
export const useUpdateCollectionAddress = () => {
  const {
    isPending: isLoadingUpdateCollectionAddress,
    data: UpdateCollectionAddressResponse,
    mutateAsync: updateCollectionAddressMutateAsync,
    mutate: updateCollectionAddressSaleMutate,
    reset: resetUpdateCollectionAddress,
  } = useMutation({
    mutationFn: (payload: OnUpdateCollectionAddressQuery) =>
      UpdateCollectionAddressService.updateCollectionAddress(payload),
  })

  return {
    updateCollectionAddressMutateAsync,
    UpdateCollectionAddressResponse,
    isLoadingUpdateCollectionAddress,
    updateCollectionAddressSaleMutate,
    resetUpdateCollectionAddress,
  }
}
