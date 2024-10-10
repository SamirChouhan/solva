import CoreAPIService from './CoreAPIService'
import { CreateNftQuery, NFTListResponse, PutOnSaleResponse } from './interfaces/home'

import { API_ENDPOINTS } from '@/utils'

class NftMintService {
  mintNft = async (query: CreateNftQuery) => {
    return CoreAPIService.post<PutOnSaleResponse>(`${API_ENDPOINTS.PRIVATE.CREATE_NFT}`, query)
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new NftMintService()
