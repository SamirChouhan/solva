import React from 'react'

import { CardVariant } from '../../Cards/NftCard/interface'
import { getCardImageRadius, getImageSize, getBorderRadius } from '../../Cards/NftCard/utils'

import Skeleton from '@/design-systems/Atoms/Skeleton'
interface NftCardSkeletonProps {
  className?: string
  variant: CardVariant
}

const NftCardSkeleton: React.FC<NftCardSkeletonProps> = ({ variant }) => {
  if (variant === 'explore') {
    return (
      <div
        className={`dark:drop-shadow-card-dark relative flex h-full w-full  animate-pulse  cursor-pointer  flex-col items-center rounded-md  border-[#D2D2D2] bg-neutral-800 p-6  drop-shadow-card dark:bg-gray-300 `}
      >
        <div className="mb-6 w-full overflow-hidden rounded-md bg-neutral-600">
          <div className=" relative z-[7] flex  h-[320px] w-full flex-col object-contain opacity-100 shadow-2xl">
            <a className="flex h-full w-full flex-col" draggable="false" href="">
              <div className="flex h-full w-full  rounded-lg">
                <button className="relative h-full w-full overflow-hidden rounded-lg"></button>
              </div>
            </a>
          </div>
        </div>
        <div className="flex w-full flex-col items-start justify-start">
          <div className="h-[18px] w-[250px] rounded-full bg-neutral-600"></div>
          <div className="mt-2 h-[18px] w-[200px] rounded-full bg-neutral-600"></div>
        </div>

        <div className="mt-8 flex w-full flex-col items-start justify-start">
          <div className="h-[16px] w-[180px] rounded-full bg-neutral-600"></div>
          <div className="mt-2 h-[22px] w-[210px] rounded-full bg-neutral-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={` dark:drop-shadow-card-dark  relative flex h-full  w-[100%]  cursor-pointer  flex-col items-center rounded-md  border-[#D2D2D2] bg-neutral-800 p-4  drop-shadow-card   ${getBorderRadius(variant)} `}
    >
      <Skeleton className={`h-[251px] w-full rounded-md  ${getImageSize(variant)} ${getCardImageRadius(variant)}`} />
      {variant === 'example' && (
        <div className="flex w-full flex-col items-start justify-center">
          <Skeleton className="mt-5 !h-[18px] !w-[80%] rounded-md" />
          <Skeleton className="mb-3 mt-2 !h-[12px] !w-[60%] rounded-md" />
          {/* <Skeleton className="mb-2 h-[12px]  w-full" />
          <Skeleton className="mb-2 h-[12px]  w-[70%] " />
          <Skeleton className="mb-2 h-[12px] w-[60%]" /> */}
        </div>
      )}
    </div>
  )
}

export default NftCardSkeleton
