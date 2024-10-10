import { CustomCollectionListData } from '@/api-services/interfaces/home'

export interface PromptConformModalProps extends ModalProps {
  label?: string | undefined
  prompt: string
  handleUpgradePlan: (type: string) => void
}

export interface ModalProps {
  open: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>> | ((turnTo: boolean) => void)
  className?: string
}

interface CollectionList {
  name: string
  value: string
}
export interface CreateCollectionModalProps {
  open: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>> | ((turnTo: boolean) => void)
  className?: string
}
