export interface PriceCardProps {
  subsType: string
  price: number
  features: string
  description: string
  handleChoosePlan: () => void
  handleGoBack: () => void
  isLoading: boolean
}
