import CoreAPIService from './CoreAPIService'
import { ExampleListResponse } from './interfaces/home'

import { API_ENDPOINTS } from '@/utils'

class HomeService {
  getExampleNft = async () => {
    return CoreAPIService.get<ExampleListResponse>(`${API_ENDPOINTS.PUBLIC.GET_EXAMPLE_NFT}`)
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new HomeService()
