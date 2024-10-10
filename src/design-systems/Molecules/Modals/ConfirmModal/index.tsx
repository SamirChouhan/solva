import React from 'react'

import Modal from '@/design-systems/Atoms/Modal'
import Typography from '@/design-systems/Atoms/Typography'
import Button from '@/design-systems/Atoms/Button'
import { useUserContext } from '@/context/UserContext'

interface ConfirmationModalProps {
  open: boolean
  handleClose: () => void
  handleProceed: () => void
  planName: string
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ open, handleClose, handleProceed, planName }) => {
  const { signatureData } = useUserContext()
  return (
    <Modal handleClose={handleClose} open={open} popUpWrapClassName="md:!h-fit">
      <div className="m-2 flex flex-col justify-center gap-2">
        <Typography className="text-center" size="title">
          Are you sure you want to proceed with <span className="capitalize">{planName}</span> plan?
        </Typography>

        <Typography className="text-center" size="paragraph">
          New credits will be added with your previous remaining credits.
        </Typography>

        <div className="mb-4 flex flex-col">
          <Typography className="text-center" size="paragraph">
            Current Plan: {signatureData?.user?.planDetails?.planName}
          </Typography>
          <Typography className="text-center" size="paragraph">
            Remaining credits:{' '}
            {signatureData?.user?.userImagePlan?.bundleImageSize
              ? Number(signatureData?.user?.userImagePlan?.bundleImageSize) -
                Number(signatureData?.user?.userImagePlan?.totalGenerated)
              : 0}
          </Typography>
        </div>

        <div className="flex items-center justify-center gap-10">
          <Button onClick={() => handleClose()}>Cancel</Button>
          <Button variant="outlined" onClick={() => handleProceed()}>
            Proceed
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmationModal
