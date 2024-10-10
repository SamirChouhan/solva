import CoreAPIService from './CoreAPIService'
import { ViewCountQuery, ViewCountResponse } from './interfaces/home'

import { API_ENDPOINTS } from '@/utils'

class ViewCountService {
  viewCount = async (query: ViewCountQuery) => {
    return CoreAPIService.post<ViewCountResponse>(`${API_ENDPOINTS.PRIVATE.VIEW_COUNT}`, query)
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new ViewCountService()
