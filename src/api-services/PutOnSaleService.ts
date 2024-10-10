import CoreAPIService from './CoreAPIService'
import { OnSaleQuery, PutOnSaleResponse } from './interfaces/home'

import { API_ENDPOINTS } from '@/utils'

class PutOnSaleService {
  putOnsale = async (query: OnSaleQuery) => {
    return CoreAPIService.post<PutOnSaleResponse>(`${API_ENDPOINTS.PRIVATE.PUT_ON_SALE}`, query)
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new PutOnSaleService()
