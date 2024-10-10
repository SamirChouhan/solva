import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import applyCaseMiddleware, { ApplyCaseMiddlewareOptions } from 'axios-case-converter'
import { getCookie, deleteCookie } from 'cookies-next'

import { AnyObject } from '@/interfaces'
import { BASE_API_ENDPOINT, checkAccessToken, disableAccessToken } from '@/utils'

const options: ApplyCaseMiddlewareOptions = {
  caseMiddleware: {
    requestTransformer: (config: any) => config,
  },
}

const axios = applyCaseMiddleware(
  Axios.create({
    baseURL: BASE_API_ENDPOINT,
  }),
  options
)

axios.interceptors.request.use(
  config => {
    if (typeof window !== 'undefined') {
      // const accessToken = checkAccessToken()
      const accessToken = getCookie('token')
      if (accessToken) {
        config.headers.Authorization = accessToken
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

const responseData = <T extends AxiosResponse<any>>(response: T) => response.data

const handleError = (error: AxiosError) => {
  const status = error.response?.status

  if (status == 401 || status == 403) {
    deleteCookie('token')
    window.location.reload()
  }

  throw error
}

class CoreAPIService {
  get = async <R>(url: string, params: AnyObject = {}) =>
    axios
      .request<R>({
        method: 'get',
        url,
        params,
      })
      .then<R>(responseData)
      .catch(handleError)

  post = async <R>(url: string, data: AnyObject = {}, { ...config }: AxiosRequestConfig = {}) =>
    axios
      .request<R>({
        method: 'post',
        url,
        data,
        ...config,
      })
      .then<R>(responseData)
      .catch(handleError)

  put = async <R>(url: string, data: AnyObject) =>
    axios
      .request<R>({
        method: 'put',
        url,
        data,
      })
      .then<R>(responseData)
      .catch(handleError)

  patch = async <R>(url: string, data: AnyObject = {}) =>
    axios
      .request<R>({
        method: 'patch',
        url: `${url}`,
        data,
      })
      .then<R>(responseData)
      .catch(handleError)

  delete = async <R>(url: string, data: AnyObject = {}) =>
    axios
      .request<R>({
        method: 'delete',
        url: `${url}`,
        data,
      })
      .then<R>(responseData)
      .catch(handleError)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new CoreAPIService()
