import CoreAPIService from './CoreAPIService'
import { API_ENDPOINTS } from '@/utils'
import { GetPlatfromFeeResponse } from './interfaces/home'
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

class GetPlatformFeeService {
  getPlatformFee = async (payload: string) => {
    return CoreAPIService.get<GetPlatfromFeeResponse>(
      `${BASE_URL}${API_ENDPOINTS.PUBLIC.GET_PLATFORM_FEE}?network_id=${payload}`
    )
  }
}

export default new GetPlatformFeeService()
