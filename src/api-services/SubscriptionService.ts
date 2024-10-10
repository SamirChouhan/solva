import CoreAPIService from './CoreAPIService'
import { PlanListResponse, SaveSolavQuery, SubscribePlanQuery, SubscribePlanResponse } from './interfaces/home'

import { API_ENDPOINTS } from '@/utils'

class SubscriptionService {
  subscribePlan = async (query: SubscribePlanQuery) => {
    return CoreAPIService.post<SubscribePlanResponse | PaymentResponseForToken>(
      `${API_ENDPOINTS.PUBLIC.SUBSCRIBE_PLAN}`,
      query
    )
  }
  getSubscriptionPlanList = async () => {
    return CoreAPIService.get<PlanListResponse>(`${API_ENDPOINTS.PUBLIC.GET_SUBSCRIPTION_LIST}`)
  }

  saveSolavTransfer = async (query: SaveSolavQuery) => {
    return CoreAPIService.post(`${API_ENDPOINTS.PRIVATE.SAVE_SOLAV_TRANSFER}`, query)
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new SubscriptionService()
