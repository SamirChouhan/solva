import CoreAPIService from './CoreAPIService'

import { API_ENDPOINTS } from '@/utils'

interface SolavExchangeResponse {
  data: {
    ethUsdRate: number
    id: string
    maticUsdRate: number
    solavEthRate: number
    solavMaticRate: number
    updatedTime: string
  }
}

class SolavExchangeService {
  getExchangeValue = async () => {
    return CoreAPIService.get<SolavExchangeResponse>(`${API_ENDPOINTS.PUBLIC.GET_SOLAV_RATE_CONVERSION}`)
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new SolavExchangeService()
// /v1.6/get-usd-rate
