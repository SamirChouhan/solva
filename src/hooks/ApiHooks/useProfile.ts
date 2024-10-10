import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { HomeService } from '@/api-services'
import { QUERIES_KEY } from '@/utils'
import { API_ENDPOINTS } from '@/utils'
import { exampleNft } from '@/utils/DummyData'

export const useProfileNft = () => {
  const {
    isLoading: isLoadingProfileNft,
    data,
    status,
  } = useQuery({
    queryKey: [QUERIES_KEY.PRIVATE.GET_PROFILE_NFT],
    queryFn: () => HomeService.getExampleNft(),
    select: res => res.data,
    refetchOnWindowFocus: false,
    enabled: Boolean(API_ENDPOINTS.PRIVATE.GET_PROFILE_NFT),
  })

  const exampleNftData = useMemo(() => {
    if (status === 'error') {
      return exampleNft
    }
    if (status === 'pending') {
      return exampleNft
    }
    if (status === 'success') {
      return data
    }
  }, [data, status])

  return {
    isLoadingProfileNft,
    exampleNftData,
  }
}
