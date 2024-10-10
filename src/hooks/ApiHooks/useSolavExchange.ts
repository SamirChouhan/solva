import { useQuery } from '@tanstack/react-query'

import SolaveExchangeService from '@/api-services/SolaveExchangeService'

export const useSolavExchange = () => {
  return useQuery({ queryKey: ['solav'], queryFn: () => SolaveExchangeService.getExchangeValue() })
}
