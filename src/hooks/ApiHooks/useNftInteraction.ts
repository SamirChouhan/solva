import { useMutation } from '@tanstack/react-query'

import SubscriptionService from '@/api-services/SubscriptionService'
import NftInteractionService from '@/api-services/NftInteractionService'
import { SubscribePlanQuery } from '@/api-services/interfaces/home'

export const useNftInteraction = () => {
  const {
    isPending: isLikeLoading,
    mutateAsync: likeNftMutateAsync,
    data: likedResponce,
  } = useMutation({
    mutationFn: (query: {}) => NftInteractionService.likeNft(query),
  })

  const {
    isPending: isLoadingSubscribePlan,
    data: subscribePlanResponse,
    mutateAsync: subscribePlanMutateAsync,
  } = useMutation({
    mutationFn: (query: SubscribePlanQuery) => SubscriptionService.subscribePlan(query),
  })

  return {
    likedResponce,
    isLikeLoading,
    likeNftMutateAsync,
    isLoadingSubscribePlan,
    subscribePlanResponse,
    subscribePlanMutateAsync,
  }
}
