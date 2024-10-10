import React, { useState } from 'react'
import { parseEther } from 'ethers'

import Typography from '@/design-systems/Atoms/Typography'
import Button from '@/design-systems/Atoms/Button'
import { Plan } from '@/api-services/interfaces/home'
import { useUserContext } from '@/context/UserContext'
import ConfirmationModal from '@/design-systems/Molecules/Modals/ConfirmModal'

interface PricingCardProps {
  item: Plan
  isLoading: boolean
  disabled?: boolean
  index: number
  handleChoosePlan: (
    planName: string,
    id: string,
    description: string,
    userId: string,
    price: bigint,
    type: number
  ) => Promise<void>
}

const PricingCard: React.FC<PricingCardProps> = ({ item, isLoading, handleChoosePlan, disabled, index }) => {
  const { signatureData } = useUserContext()
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [isRemoveActiveOnHover, setIsRemoveActiveOnHover] = useState<boolean>(false)

  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-neutral-800 p-4 py-8 dark:bg-neutral-300">
      <Typography className="mb-2 font-medium capitalize" size="title">
        {item.planName}
      </Typography>
      <Typography className="text-gray-400 mb-8 mt-4 text-center text-lg sm:text-xl" size="paragraph">
        <span className="text-h4 font-bold sm:text-h3">
          {item.tokenPrice ? item.tokenPrice.toPrecision(5) : ''} SOL
        </span>{' '}
      </Typography>
      <ul className="mb-6 list-inside list-none text-center">
        <li>
          <Typography className="capitalize" size="paragraph">
            {' '}
            Quality: {item.quality}{' '}
          </Typography>
        </li>

        <li>
          <Typography className="capitalize" size="paragraph">
            Bundle Size: {item.bundleSize}
          </Typography>
        </li>

        <li>
          <Typography className="capitalize" size="paragraph">
            Resolution: {item.resolution.map(item => item).join(', ')}
          </Typography>
        </li>
      </ul>
      <Button
        className="relative text-sm font-semibold text-black"
        color={item.id === signatureData.user?.planDetails?.id ? 'green' : 'pink'}
        disabled={disabled}
        loading={isLoading}
        onClick={() => {
          if (signatureData.user?.planDetails) {
            setIsOpenModal(true)
          } else {
            handleChoosePlan(
              item.planName,
              item.id,
              item.description,
              signatureData.user.id,
              parseEther(item.tokenPrice.toString()),
              index
            )
          }
        }}
        onMouseEnter={() => {
          item.id === signatureData.user?.planDetails?.id ? setIsRemoveActiveOnHover(true) : undefined
        }}
        onMouseLeave={() => {
          item.id === signatureData.user?.planDetails?.id ? setIsRemoveActiveOnHover(false) : undefined
        }}
      >
        {item.id === signatureData.user?.planDetails?.id ? (isRemoveActiveOnHover ? 'Buy Now' : 'Active') : 'Buy Now'}
      </Button>

      <ConfirmationModal
        handleClose={() => setIsOpenModal(false)}
        handleProceed={() => {
          setIsOpenModal(false)
          handleChoosePlan(
            item.planName,
            item.id,
            item.description,
            signatureData.user.id,
            parseEther(item.tokenPrice.toString()),
            index
          )
        }}
        open={isOpenModal}
        planName={item.planName}
      />
    </div>
  )
}

export default PricingCard
