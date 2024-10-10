import CoreAPIService from './CoreAPIService'
import { OnCreateCollectionQuery, CreateCollectionResponse } from './interfaces/home'

import { API_ENDPOINTS } from '@/utils'

class CreateCollectionService {
  createCollection = async (query: OnCreateCollectionQuery) => {
    return CoreAPIService.post<CreateCollectionResponse>(`${API_ENDPOINTS.PRIVATE.CREATE_COLLECTION}`, query, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new CreateCollectionService()
