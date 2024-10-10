import { useMutation } from '@tanstack/react-query'

import { CreateNftQuery } from '@/api-services/interfaces/home'
import MintNftService from '@/api-services/MintNftService'

export const useCreateNft = () => {
  const {
    isPending: isLoadingCreateNft,
    data: createNftResponse,
    mutateAsync: createNftMutateAsync,
    reset: resetCreateNft,
  } = useMutation({
    mutationFn: (payload: CreateNftQuery) => MintNftService.mintNft(payload),
  })

  return {
    createNftMutateAsync,
    createNftResponse,
    isLoadingCreateNft,
    resetCreateNft,
  }
}
