import { getTokenPriceStyles } from './utils'

import Typography from '@/design-systems/Atoms/Typography'
import { classNames } from '@/utils'

export type PriceCardSize = 'small' | 'medium' | 'large' | 'x-large'

export interface PriceCardProps {
  size?: PriceCardSize
  label?: string
  price?: string | number
  token?: string
  className?: string
}

export const PriceCard: React.FC<PriceCardProps> = ({ size = 'medium', price = '0', className = '', token }) => {
  return (
    <div className={`${className} flex items-center space-x-1 md:items-start`}>
      <div className="text-neutral-100 dark:text-neutral-800">
        {/* <Typography className="truncate text-sm font-normal" variant="condensed">
          {label}
        </Typography> */}
        <div className="gap-1">
          <div className="gap-1">
            <Typography
              className={classNames(
                'truncate text-subtitle !font-bold leading-title text-neutral-100 dark:text-neutral-500',
                getTokenPriceStyles(size)
              )}
              variant="condensed"
            >
              {parseFloat(price.toString())} {token}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}
