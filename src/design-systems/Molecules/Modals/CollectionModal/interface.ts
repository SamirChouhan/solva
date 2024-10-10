import { CreateCollectionModalProps } from '../PromptConformModal/interface'

export interface CollectionModalProps extends CreateCollectionModalProps {
  handleCreate: () => void
  onCollectionCreated: () => void
}
