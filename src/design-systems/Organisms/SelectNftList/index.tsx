import React, { FC, useCallback, useMemo } from 'react'

import { SelectNftListProps } from './interfaces'

import { usePromptContext } from '@/context/PromptContext'
import NftCard from '@/design-systems/Molecules/Cards/NftCard'
import NftCardSkeleton from '@/design-systems/Molecules/Skeletons/NftCardSkeleton'
import Typography from '@/design-systems/Atoms/Typography'
import { GeneratedNFT } from '@/api-services/interfaces/home'

export const SelectNftList: FC<SelectNftListProps> = ({ generatedNftList, isLoading }) => {
  const { selectedNft, setSelectedNft } = usePromptContext()

  const handleClick = useCallback(
    (item: GeneratedNFT) => {
      if (item.id === selectedNft?.id) {
        setSelectedNft(undefined)
      } else {
        setSelectedNft(item)
      }
    },
    [selectedNft, setSelectedNft]
  )

  const getCard = useMemo(() => {
    if (isLoading) {
      return Array(6)
        .fill('')
        .map((_, idx) => {
          return (
            <div className=" h-[249px] w-[100%] sm:h-[270px] smd:h-auto smd:w-[95%] lmd:w-[48%] lg:w-[30.8%]" key={idx}>
              <NftCardSkeleton variant="generated" />
            </div>
          )
        })
    } else {
      return generatedNftList.map((item, idx) => {
        return (
          <div className="w-[100%] smd:w-[95%] lmd:w-[48%] lg:w-[31.8%]" key={idx}>
            <NftCard
              isLike={false}
              isLink={false}
              isOtherSelected={Boolean(selectedNft) && item.id !== selectedNft?.id}
              isSelected={item.id === selectedNft?.id}
              src={item.imageUrl}
              variant="generated"
              onClick={() => handleClick(item)}
            />
          </div>
        )
      })
    }
  }, [generatedNftList, handleClick, isLoading, selectedNft])

  return (
    <>
      {generatedNftList.length === 0 && !isLoading ? (
        <div className="flex h-[60vh] w-full items-center justify-center">
          <Typography size="heading">Generate with new prompt.</Typography>
        </div>
      ) : (
        <div className="flex flex-row flex-wrap items-center justify-center gap-[21px]  smd:justify-start">
          {getCard}
        </div>
      )}
    </>
  )
}
