import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { QUERIES_KEY } from '@/utils'
import { API_ENDPOINTS } from '@/utils'
import SubscriptionService from '@/api-services/SubscriptionService'
import { SubscribePlanQuery } from '@/api-services/interfaces/home'
import { useUserContext } from '@/context/UserContext'

export const useSubscription = () => {
  const { signatureData } = useUserContext()
  const { isLoading: subscriptionPlanListLoading, data } = useQuery({
    queryKey: [QUERIES_KEY.PUBLIC.GET_SUBSCRIPTION_LIST],
    queryFn: () => SubscriptionService.getSubscriptionPlanList(),
    select: res => res.data,
    refetchOnWindowFocus: false,
    enabled: Boolean(API_ENDPOINTS.PUBLIC.GET_SUBSCRIPTION_LIST) && !!signatureData?.token,
  })

  const {
    isPending: isLoadingSubscribePlan,
    data: subscribePlanResponse,
    mutateAsync: subscribePlanMutateAsync,
  } = useMutation({
    mutationFn: (query: SubscribePlanQuery) => SubscriptionService.subscribePlan(query),
  })

  const subscriptionPlanList = useMemo(() => {
    return data || []
  }, [data])

  return {
    subscriptionPlanList,
    subscriptionPlanListLoading,
    isLoadingSubscribePlan,
    subscribePlanResponse,
    subscribePlanMutateAsync,
  }
}
