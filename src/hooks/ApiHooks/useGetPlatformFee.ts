import { useMutation } from '@tanstack/react-query'

import { GetPlatformFeeService } from '@/api-services'

export const useGetPlatformFee = () => {
  const {
    isPending: isLoadingPlatformFee,
    data: getPlatformFeeResponse,
    mutateAsync: getPlatformFeeMutateAsync,
  } = useMutation({
    mutationFn: (payload: string) => GetPlatformFeeService.getPlatformFee(payload),
  })

  return {
    isLoadingPlatformFee,
    getPlatformFeeResponse,
    getPlatformFeeMutateAsync,
  }
}
