import SaveEventNftService from '@/api-services/SaveEventNftService'
import { OnSaveEventNftQuery } from '@/api-services/interfaces/item-details'
import { useMutation } from '@tanstack/react-query'

export const useSaveEventNft = () => {
  const {
    isPending: isLoadingSaveEventNft,
    data: saveEventNftResponse,
    mutateAsync: saveEventNftMutateAsync,
    mutate: saveEventNftMutate,
    reset: resetSaveEventNft,
  } = useMutation({
    mutationFn: (payload: OnSaveEventNftQuery) => SaveEventNftService.saveEventNft(payload),
  })

  return {
    saveEventNftMutateAsync,
    saveEventNftResponse,
    isLoadingSaveEventNft,
    saveEventNftMutate,
    resetSaveEventNft,
  }
}
