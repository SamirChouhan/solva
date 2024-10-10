interface USDRateObject {
  ethRate: number
  ethUsdtRate: number
  id: string
  updatedTime: string
}

interface USDRateResponse {
  code: number
  data: USDRateObject
  message: string
  status: boolean
}
