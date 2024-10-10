import { PropsWithChildren, ChangeEventHandler } from 'react'

export type FileType = 'image' | 'video' | 'audio'

export interface UploadFileProps extends PropsWithChildren {
  handleChangeFile?: ChangeEventHandler<HTMLInputElement>
  type?: FileType
  message: string
  isBanner?: true
  className?: string
}
