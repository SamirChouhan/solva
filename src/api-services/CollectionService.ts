import CoreAPIService from './CoreAPIService'
import {
  CollectionDetails,
  CollectionItemAndActivity,
  CollectionItemAndActivityQuery,
  CollectionQuery,
} from './interfaces/collection'

import { API_ENDPOINTS, getQueries } from '@/utils'

class CollectionService {
  getCollectionDetails(query: CollectionQuery) {
    return CoreAPIService.get<CollectionDetails>(`${API_ENDPOINTS.PUBLIC.GET_COLLECTION_DETAILS}${getQueries(query)}`)
  }

  getCollectionActivityAndItems(query: CollectionItemAndActivityQuery) {
    return CoreAPIService.get<CollectionItemAndActivity>(
      `${API_ENDPOINTS.PUBLIC.GET_COLLECTION_ITEM_AND_ACTIVITY}${getQueries(query)}`
    )
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new CollectionService()
