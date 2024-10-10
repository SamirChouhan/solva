import { useMutation } from '@tanstack/react-query'

import { AuthService } from '@/api-services'
import { SignatureType } from '@/api-services/interfaces/auth'

export const useGetSignature = () => {
  const {
    isPending: isLoadingSignature,
    data: signatureResponse,
    mutateAsync: signatureMutateAsync,
  } = useMutation({
    mutationFn: (payload: SignatureType) => AuthService.getSignature(payload),
  })

  return {
    isLoadingSignature,
    signatureResponse,
    signatureMutateAsync,
  }
}
