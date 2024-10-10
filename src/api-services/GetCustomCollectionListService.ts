import CoreAPIService from './CoreAPIService'
import { CustomCollectionListResponse } from './interfaces/home'

import { API_ENDPOINTS } from '@/utils'

class GetCustomCollectionListService {
  getCustomcollectionList = async (query: string) => {
    return CoreAPIService.get<CustomCollectionListResponse>(
      `${API_ENDPOINTS.PUBLIC.GET_CUSTOM_COLLECTION_LIST}connectedNetworkId=${query}`
    ).then(res => {
      return {
        code: res.code,
        data: res.data,
        message: res.message,
        status: res.status,
      }
    })
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new GetCustomCollectionListService()
