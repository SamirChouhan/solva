import { GetItemDetailInterface, ItemActivityResponse, ItemDetailsResponse } from './interfaces/item-details'

import { API_ENDPOINTS, BASE_API_ENDPOINT, getQueries } from '@/utils'

class ItemDetailService {}

const itemDetailServiceInstance = new ItemDetailService()
export default itemDetailServiceInstance

export const getItemDetails = async ({ collectible_id }: GetItemDetailInterface) => {
  try {
    const url = `${BASE_API_ENDPOINT}${API_ENDPOINTS.PUBLIC.GET_ITEM_DETAILS}${getQueries({ collectible_id })}`
    const res = await fetch(url, { cache: 'no-store' })
    const data = await res.json()
    return data as ItemDetailsResponse
  } catch (error) {
    return {
      data: {},
      code: 400,
      message: 'Something went wrong',
      status: false,
    } as ItemDetailsResponse
  }
}

export const getItemActivity = async ({ collectible_id }: GetItemDetailInterface) => {
  try {
    const url = `${BASE_API_ENDPOINT}${API_ENDPOINTS.PUBLIC.GET_ITEM_ACTIVITY}${getQueries({ collectible_id })}`
    const res = await fetch(url, { cache: 'no-store' })
    const data = await res.json()
    return data as ItemActivityResponse
  } catch (error) {
    console.error(error)
    return {
      data: [],
      code: 400,
      message: 'Something went wrong',
      status: false,
    } as ItemActivityResponse
  }
}
