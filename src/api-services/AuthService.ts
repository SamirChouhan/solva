import CoreAPIService from './CoreAPIService'
import { NonceResponse, NonceType, SignatureResponse, SignatureType } from './interfaces/auth'

import { API_ENDPOINTS } from '@/utils'

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
class AuthService {
  getNonce = async (payload: NonceType) => {
    return CoreAPIService.post<NonceResponse>(`${BASE_URL}${API_ENDPOINTS.PRIVATE.GET_NONCE}`, payload)
  }
  getSignature = async (payload: SignatureType) => {
    return CoreAPIService.post<SignatureResponse>(`${BASE_URL}${API_ENDPOINTS.PRIVATE.GET_SIGNATURE}`, payload)
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new AuthService()
