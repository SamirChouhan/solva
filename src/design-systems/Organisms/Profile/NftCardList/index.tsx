import React from 'react'

import { NftCardListProps } from './interface'

import NftCard from '@/design-systems/Molecules/Cards/NftCard'
import Typography from '@/design-systems/Atoms/Typography'
import NftCardSkeleton from '@/design-systems/Molecules/Skeletons/NftCardSkeleton'
import { getNftPrice, getSaleStatus } from '@/utils'

const NftCardList: React.FC<NftCardListProps> = ({ data = [], isLoading, tab, isFetching }) => {
  if (isLoading) {
    return (
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 slg:grid-cols-3">
        <NftCardSkeleton variant={tab === 'generated' ? 'example' : 'explore'} />
        <NftCardSkeleton variant={tab === 'generated' ? 'example' : 'explore'} />
        <NftCardSkeleton variant={tab === 'generated' ? 'example' : 'explore'} />
      </div>
    )
  }

  return (
    <>
      {data && data.filter(nft => !!nft).length ? (
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 slg:grid-cols-3">
          {data.map(asset => {
            return (
              <NftCard
                auctionDetails={asset.auctionDetails}
                collectibleOwner={asset.collectibleOwner}
                generatedImagePrompt={asset.generatedImagePrompt}
                heading={asset.title}
                id={asset.id}
                isLike={!!asset.isLike}
                isLink={tab === 'generated' ? false : true}
                isMinted={asset.isMinted}
                isShowPromptPublicly={asset.isShowPromptPublicly}
                key={asset.id}
                network={asset?.networkId}
                price={getNftPrice(asset)}
                src={tab === 'generated' ? asset.image : asset.previewUrl}
                status={getSaleStatus(asset)}
                subHeading={asset.description}
                variant={tab === 'generated' ? 'example' : 'explore'}
              />
            )
          })}
        </div>
      ) : (
        <>
          {isFetching ? (
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 slg:grid-cols-3">
              <NftCardSkeleton variant={tab === 'generated' ? 'example' : 'explore'} />
              <NftCardSkeleton variant={tab === 'generated' ? 'example' : 'explore'} />
              <NftCardSkeleton variant={tab === 'generated' ? 'example' : 'explore'} />
            </div>
          ) : (
            <Typography className="mb-[60px] w-full text-center" size="paragraph">
              No Record Found
            </Typography>
          )}
        </>
      )}
    </>
  )
}

export default NftCardList
