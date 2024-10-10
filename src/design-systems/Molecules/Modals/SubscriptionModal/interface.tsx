import { ModalProps } from '../PromptConformModal/interface'

export interface SubscriptionModalProps extends ModalProps {
  subsType: string
  price: number
  features: string
  description: string
  handleChoosePlan: () => void
  handleGoBack: () => void
  isLoading: boolean
}
