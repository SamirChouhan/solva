import CoreAPIService from './CoreAPIService'
import { GenerateNftQuery } from './interfaces/generateNft'
import { GeneratedNFTListResponse } from './interfaces/home'

import { API_ENDPOINTS, getQueries } from '@/utils'

class GenerateNftService {
  getGenerateNft = async (query: GenerateNftQuery) => {
    return CoreAPIService.get<GeneratedNFTListResponse>(`${API_ENDPOINTS.PRIVATE.GET_GENERATE_NFT}${getQueries(query)}`)
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new GenerateNftService()
