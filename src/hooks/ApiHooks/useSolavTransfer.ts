import { useMutation } from '@tanstack/react-query'

import SubscriptionService from '@/api-services/SubscriptionService'
import { SaveSolavQuery } from '@/api-services/interfaces/home'

export const useSolavTransfer = () => {
  const solavTransferMutation = useMutation({
    mutationFn: (query: SaveSolavQuery) => SubscriptionService.saveSolavTransfer(query),
  })

  return solavTransferMutation
}
