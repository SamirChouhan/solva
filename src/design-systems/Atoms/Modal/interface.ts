import { PropsWithChildren } from 'react'
export interface ModalCreateProps extends PropsWithChildren {
  open: boolean
  label?: string
  overLayClassName?: string
  popUpWrapClassName?: string
  handleClose: VoidFunction
  description?: string
}
