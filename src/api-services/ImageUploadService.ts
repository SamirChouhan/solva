import CoreAPIService from './CoreAPIService'

import { API_ENDPOINTS, getQueries } from '@/utils'

class ImageUploadService {
  getUploadUrl = async (query: object) => {
    return CoreAPIService.get<{ preSignedUrl: string; regularUrl: string }>(
      `${API_ENDPOINTS.PRIVATE.IMAGE_UPLOAD}${getQueries(query)}`
    )
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new ImageUploadService()
