import { useMutation } from '@tanstack/react-query'

import { SearchHeaderService } from '@/api-services'
import { SearchType } from '@/api-services/interfaces/auth'

export const useHeaderSearch = () => {
  const {
    isPending: isLoadingSearch,
    data: searchResponse,
    mutateAsync: searchMutateAsync,
  } = useMutation({
    mutationFn: (payload: SearchType) => SearchHeaderService.getHeaderSearch(payload),
  })

  return {
    isLoadingSearch,
    searchResponse,
    searchMutateAsync,
  }
}
