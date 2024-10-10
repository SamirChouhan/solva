import React from 'react'

import { searchData } from '@/api-services/interfaces/auth'
import Typography from '@/design-systems/Atoms/Typography'
import NftCard from '@/design-systems/Molecules/Cards/NftCard'
import NftCardSkeleton from '@/design-systems/Molecules/Skeletons/NftCardSkeleton'
import { getNftPrice, getSaleStatus } from '@/utils'
import { ScrollTrigger } from '@/design-systems/Atoms/ScrollTrigger'

interface CollectionCardListProps {
  data?: searchData[] | undefined
  isLoading?: boolean
  tab?: string
  isFetching?: boolean
  isFetchingNextPage?: boolean
  hasNextPage?: boolean
  fetchNextPage: () => void
}

const CollectionCardList: React.FC<CollectionCardListProps> = ({
  data = [],
  isLoading,
  tab,
  isFetching,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}) => {
  if (isLoading) {
    return (
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 slg:grid-cols-3">
        <NftCardSkeleton variant={'explore'} />
        <NftCardSkeleton variant={'explore'} />
        <NftCardSkeleton variant={'explore'} />
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
                auctionDetails={asset?.auctionDetails}
                collectibleOwner={asset?.collectibleOwner}
                generatedImagePrompt={asset?.generatedImagePrompt}
                heading={asset.title}
                id={asset.id}
                isLike={!!asset.isLike}
                isLink={true}
                isMinted={asset.isMinted}
                isShowPromptPublicly={asset.isShowPromptPublicly}
                key={asset.id}
                network={asset?.networkId}
                price={getNftPrice(asset)}
                src={asset.previewUrl}
                status={getSaleStatus(asset)}
                subHeading={asset.description}
                tab={tab}
                variant={'explore'}
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

      <ScrollTrigger
        isLoading={isFetching}
        onTrigger={() => {
          if (!isLoading && !isFetchingNextPage && hasNextPage) {
            fetchNextPage()
          }
        }}
      />
    </>
  )
}

export default CollectionCardList
