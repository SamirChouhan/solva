import React, { FC } from 'react'

import { SelectableCardProps } from './interfaces'

import { Checkbox } from '@/design-systems/Atoms/Checkbox'
import Image from '@/design-systems/Atoms/Image'
const SelectableCard: FC<SelectableCardProps> = ({ image, isSelected, onClick, isOtherSelected }) => {
  return (
    <div className="relative rounded-md" onClick={onClick}>
      <Checkbox checked={isSelected} className="absolute left-[10px] top-[10px] z-10" />
      <Image alt="nftimage" src={image} />
      {!isSelected && isOtherSelected && (
        <div className="absolute left-0 top-0 z-50 h-full w-full bg-white opacity-60"></div>
      )}
    </div>
  )
}
export default SelectableCard
