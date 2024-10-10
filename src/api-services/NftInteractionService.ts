import CoreAPIService from './CoreAPIService'
import { NFTListResponse } from './interfaces/home'

import { API_ENDPOINTS } from '@/utils'

class NftInteractionService {
  likeNft = async (query: {}) => {
    return CoreAPIService.post<NFTListResponse>(`${API_ENDPOINTS.PUBLIC.GET_EXAMPLE_NFT}`, query)
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new NftInteractionService()
