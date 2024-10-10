import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { HomeService } from '@/api-services'
import { QUERIES_KEY } from '@/utils'
import { API_ENDPOINTS } from '@/utils'

export const useExampleNft = () => {
  const { isLoading: isLoadingExampleNft, data } = useQuery({
    queryKey: [QUERIES_KEY.PUBLIC.GET_EXAMPLE_NFT],
    queryFn: () => HomeService.getExampleNft(),
    select: res => res.data,
    refetchOnWindowFocus: false,
    enabled: Boolean(API_ENDPOINTS.PUBLIC.GET_EXAMPLE_NFT),
  })

  const exampleNftData = useMemo(() => {
    return data
  }, [data])

  return {
    isLoadingExampleNft,
    exampleNftData,
  }
}
