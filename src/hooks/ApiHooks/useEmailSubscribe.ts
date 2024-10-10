import { useMutation } from '@tanstack/react-query'

import EmailSubscribeServices from '@/api-services/EmailSubscribeServices'
import { EmailPayload } from '@/api-services/interfaces/home'

export const useEmailSubscribe = () => {
  const {
    isPending: isLoadingEmailSubscribe,
    data: EmailSubscribeResponse,
    mutateAsync: EmailMutateAsync,
  } = useMutation({
    mutationFn: (payload: EmailPayload) => EmailSubscribeServices.emailSubscribe(payload),
  })

  return {
    isLoadingEmailSubscribe,
    EmailSubscribeResponse,
    EmailMutateAsync,
  }
}
