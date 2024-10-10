export interface MintingLoadingModalProps {
  open: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>> | ((turnTo: boolean) => void)
  className?: string
  handleCancel: () => void
  statusMessageStep: string
  statusMessageHead: string
}
