import { useMutation } from '@tanstack/react-query'

import { OnCreateCollectionQuery } from '@/api-services/interfaces/home'
import CreateCollectionService from '@/api-services/CreateCollectionService'
export const useCreateCollection = () => {
  const {
    isPending: isLoadingCreateCollection,
    data: createCollectionResponse,
    mutateAsync: createCollectionMutateAsync,
    mutate: createCollectionMutate,
    reset: resetCreateCollection,
  } = useMutation({
    mutationFn: (payload: OnCreateCollectionQuery) => CreateCollectionService.createCollection(payload),
  })

  return {
    createCollectionMutateAsync,
    createCollectionResponse,
    isLoadingCreateCollection,
    createCollectionMutate,
    resetCreateCollection,
  }
}
