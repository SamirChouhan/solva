import CoreAPIService from './CoreAPIService'
import { NFTListResponse } from './interfaces/home'

import { API_ENDPOINTS, getQueries } from '@/utils'

class ProfileService {
  getProfileNft = async (query: ProfileNftQuery) => {
    return CoreAPIService.get<NFTListResponse>(`${API_ENDPOINTS.PRIVATE.GET_PROFILE_NFT}${getQueries(query)}`).then(
      res => {
        return {
          code: res.code,
          data: res.data,
          message: res.message,
          status: res.status,
        }
      }
    )
  }
  getUserData = async (query: ProfileDataQuery) => {
    return CoreAPIService.get<UserDataResponse>(`${API_ENDPOINTS.PRIVATE.GET_USER_DATA}${getQueries(query)}`)
  }

  getGenerateTabData = async (query: GenerateTabDataQuery) => {
    return CoreAPIService.get<GenerateTabDataResponse>(
      `${API_ENDPOINTS.PRIVATE.GET_GENERATE_TAB_DATA}${getQueries(query)}`
    )
  }

  getMintedTabData = async (query: MintedAndFavoriteTabDataQuery) => {
    return CoreAPIService.get<GenerateTabDataResponse>(
      `${API_ENDPOINTS.PRIVATE.GET_MINTED_TAB_DATA}${getQueries(query)}`
    )
  }

  getFavoriteTabData = async (query: MintedAndFavoriteTabDataQuery) => {
    return CoreAPIService.get<GenerateTabDataResponse>(
      `${API_ENDPOINTS.PRIVATE.GET_FAVORITE_TAB_DATA}${getQueries(query)}`
    )
  }

  updateUserProfile = async (query: UserData) => {
    return CoreAPIService.post(`${API_ENDPOINTS.PRIVATE.UPDATE_USER_DATA}`, query)
  }

  doLike = async (data: LikeDataMutationType) => {
    return CoreAPIService.post<{ message: string; data: { isLike: boolean } }>(`${API_ENDPOINTS.PRIVATE.DO_LIKE}`, data)
  }

  getListingList = async (query: GetListingData) => {
    return CoreAPIService.get<GenerateTabDataResponse>(`${API_ENDPOINTS.PRIVATE.GET_LISTING_LIST}${getQueries(query)}`)
  }

  getUserPlanHistory = async (query: UserPlanHistoryQuery) => {
    return CoreAPIService.get<UserPlanHistoryResponse>(
      `${API_ENDPOINTS.PRIVATE.GET_USER_PLAN_HISTORY}${getQueries(query)}`
    )
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new ProfileService()
