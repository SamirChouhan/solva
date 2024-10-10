import CoreAPIService from './CoreAPIService'
import { SaveEventNftResponse } from './interfaces/home'

import { API_ENDPOINTS } from '@/utils'
import { OnSaveEventNftQuery } from './interfaces/item-details'

class SaveEventNftService {
  saveEventNft = async (query: OnSaveEventNftQuery) => {
    return CoreAPIService.post<SaveEventNftResponse>(`${API_ENDPOINTS.PRIVATE.SAVE_EVENT_NFT}`, query)
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new SaveEventNftService()
