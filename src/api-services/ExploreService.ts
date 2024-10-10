import CoreAPIService from './CoreAPIService'
import { ExploreType, SearchResponse } from './interfaces/auth'

import { API_ENDPOINTS, getQueries } from '@/utils'

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

class ExploreService {
  getExplore = async (query: ExploreType) => {
    return CoreAPIService.get<SearchResponse>(`${BASE_URL}${API_ENDPOINTS.PUBLIC.GET_SEARCH}?${getQueries(query)}`)
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new ExploreService()
