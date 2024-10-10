import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { MintingLoadingModalProps } from './interface'
import Typography from '@/design-systems/Atoms/Typography'
import Button from '@/design-systems/Atoms/Button'
import Modal from '@/design-systems/Atoms/Modal'
import { usePromptContext } from '@/context/PromptContext'

const MintingLoadingModal: React.FC<MintingLoadingModalProps> = ({
  open,
  setIsModalOpen,
  className,
  handleCancel,
  statusMessageStep,
  statusMessageHead,
}) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(open)

  const { selectedNft } = usePromptContext()

  useEffect(() => {
    setModalOpen(open)
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  const handleClose = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <Modal handleClose={handleClose} label={''} open={isModalOpen}>
        <div className={`${className} h-full w-full`}>
          <div className="flex items-center justify-center">
            <div className="w-fit rounded-md bg-[#E2E2E1] p-[14px]">
              <Image alt="image" className="rounded-md" height={186} src={selectedNft?.imageUrl || ''} width={223} />
            </div>
          </div>
          <Typography className="mt-4 text-center" size="paragraph">
            {statusMessageStep}
          </Typography>
          <Typography className="mt-3 text-center" size="heading">
            {statusMessageHead}
          </Typography>
          {statusMessageStep === 'Step 2' && (
            <Typography className="mt-3 text-center text-md">
              We have sent a transaction to create your NFT check your wallet
            </Typography>
          )}
          <div className="mt-4">
            <Button fullWidth={true} variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default MintingLoadingModal
