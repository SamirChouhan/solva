import React, { FC } from 'react'

import { PriceCardProps } from './interface'

import Button from '@/design-systems/Atoms/Button'
import { brandGradient } from '@/utils'
import Typography from '@/design-systems/Atoms/Typography'
const SubscriptionPriceCard: FC<PriceCardProps> = ({
  price,
  features,
  description,
  handleChoosePlan,
  handleGoBack,
  isLoading,
}) => {
  return (
    <div className="flex flex-col justify-center gap-8">
      <div>
        <div className="mx-auto  flex items-end justify-center">
          <Typography
            className={`text-center font-poppins text-[30px] ${brandGradient} bg-clip-text text-transparent`}
            size="subtitle"
          >
            {'$'}
          </Typography>
          <Typography
            className={`text-center font-poppins  text-[60px] font-bold ${brandGradient} bg-clip-text text-transparent`}
            size="h1"
          >
            {price}
          </Typography>
        </div>
        <Typography className="text-center" size="paragraph">
          {features}
        </Typography>
      </div>
      <Typography className="text-center text-neutral-400 dark:text-neutral-1000 " size="paragraph">
        {description}
      </Typography>
      <div className="flex justify-center gap-3">
        <Button className="px-6" variant="outlined" onClick={handleGoBack}>
          Go Back
        </Button>
        <Button className="px-6 text-white" loading={isLoading} onClick={handleChoosePlan}>
          Confirm
        </Button>
      </div>
    </div>
  )
}

export default SubscriptionPriceCard
