import CoreAPIService from './CoreAPIService'
import { OnUpdateCollectionAddressQuery, UpdateCollectionAddressResponse } from './interfaces/home'

import { API_ENDPOINTS } from '@/utils'

class UpdateCollectionAddressService {
  updateCollectionAddress = async (query: OnUpdateCollectionAddressQuery) => {
    return CoreAPIService.post<UpdateCollectionAddressResponse>(
      `${API_ENDPOINTS.PRIVATE.UPDATE_COLLECTION_ADDRESS}`,
      query
    )
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new UpdateCollectionAddressService()
