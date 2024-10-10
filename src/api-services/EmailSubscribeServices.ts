import CoreAPIService from './CoreAPIService'
import { EmailPayload, EmailSubscribeResponse } from './interfaces/home'

import { API_ENDPOINTS } from '@/utils'

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

class EmailSubscribeService {
  emailSubscribe = async (payload: EmailPayload) => {
    return CoreAPIService.post<EmailSubscribeResponse>(
      `${BASE_URL}${API_ENDPOINTS.PUBLIC.POST_EMAIL_SUBSCRIBE}`,
      payload
    )
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new EmailSubscribeService()
