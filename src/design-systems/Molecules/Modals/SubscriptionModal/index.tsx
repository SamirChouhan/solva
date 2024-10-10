import React, { useState, useEffect } from 'react'

import SubscriptionPriceCard from '../../Cards/SubscriptionPriceCard'

import { SubscriptionModalProps } from './interface'

import Modal from '@/design-systems/Atoms/Modal'

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  open,
  setIsModalOpen,
  subsType,
  price,
  description = '',
  features,
  handleChoosePlan,
  handleGoBack,
  isLoading,
}) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(open)

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
      {open && (
        <>
          <Modal description="" handleClose={handleClose} label={subsType} open={isModalOpen}>
            <SubscriptionPriceCard
              description={'25 images'}
              features={features}
              handleChoosePlan={handleChoosePlan}
              handleGoBack={handleGoBack}
              isLoading={isLoading}
              price={3}
              subsType={subsType}
            />
          </Modal>
        </>
      )}
    </>
  )
}

export default SubscriptionModal
