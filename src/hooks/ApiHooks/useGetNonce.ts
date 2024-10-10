import { useMutation } from '@tanstack/react-query'

import { AuthService } from '@/api-services'
import { NonceType } from '@/api-services/interfaces/auth'

export const useGetNonce = () => {
  const {
    isPending: isLoadingNonce,
    data: nonceResponse,
    mutateAsync: nonceMutateAsync,
  } = useMutation({
    mutationFn: (payload: NonceType) => AuthService.getNonce(payload),
  })

  return {
    isLoadingNonce,
    nonceResponse,
    nonceMutateAsync,
  }
}
