import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { GenerateNftService } from '@/api-services'
import { QUERIES_KEY } from '@/utils'
import { GeneratedNFT } from '@/api-services/interfaces/home'
import { GenerateNftQuery } from '@/api-services/interfaces/generateNft'
import { useUserContext } from '@/context/UserContext'

export const useGenerateNft = (query: GenerateNftQuery) => {
  const { setRemainingCredit } = useUserContext()
  const {
    isLoading: isLoadingGeneratedNft,
    data,
    status: generatedNftStatus,
    refetch: refetchGeneratedNft,
    isRefetching: isRefatchingGeneratedNft,
  } = useQuery({
    queryKey: [QUERIES_KEY.PUBLIC.GET_GENERATE_NFT, ...Object.values(query)],
    queryFn: () => GenerateNftService.getGenerateNft(query),
    refetchOnWindowFocus: false,
    enabled: Boolean(query.prompt),
  })

  const generatedNftData = useMemo(() => {
    return data?.data ? data?.data.map(item => ({ id: item.id, imageUrl: item.imageUrl })) : ([] as GeneratedNFT[])
  }, [data])

  useEffect(() => {
    if (generatedNftStatus === 'success' && data?.code !== 400) {
      setRemainingCredit(prev => prev - 1)
    }
  }, [generatedNftStatus, setRemainingCredit, data?.code])

  return {
    isLoadingGeneratedNft,
    generatedNftData,
    generatedNftStatus,
    refetchGeneratedNft,
    isRefatchingGeneratedNft,
    message: data?.message,
    code: data?.code,
  }
}
