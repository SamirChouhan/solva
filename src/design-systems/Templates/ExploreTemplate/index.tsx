'use client'
import React, { FC, useState } from 'react'
import { getAccount } from '@wagmi/core'

import Tab from '@/design-systems/Atoms/Tabs'
import NftCard from '@/design-systems/Molecules/Cards/NftCard'
import { explorePageTabs, getNftPrice, getSaleStatus } from '@/utils'
import { useExplore } from '@/hooks/ApiHooks/useExplore'
import { ScrollTrigger } from '@/design-systems/Atoms/ScrollTrigger'
import NftCardSkeleton from '@/design-systems/Molecules/Skeletons/NftCardSkeleton'
import { SearchResponse } from '@/api-services/interfaces/auth'
import Typography from '@/design-systems/Atoms/Typography'
import FilterDropDown from '@/design-systems/Atoms/DropDown/FiterDropdown'
import { config } from '@/context/wagmiContext/config'

const filters = [
  {
    dropdownType: 'network',
    label: 'Network',
    key: 'Network',
    child: [
      { label: 'All', key: 'all' },
      { label: 'Ethereum', key: '1' },
      { label: 'Polygon', key: '2' },
    ],
  },
  {
    dropdownType: 'sort',
    label: 'Sort by',
    key: 'sort',
    child: [
      { label: 'Recently Added', key: 'recently_added' },
      { label: 'Price: Low to high', key: 'price_low_to_high' },
      { label: 'Price: High to low', key: 'price_high_to_low' },
      { label: 'Auction Ending soon', key: 'auction_ending_soon' },
    ],
  },
]

const time = [
  { label: 'All', key: 'all' },
  { label: 'Fixed Price', key: 'fixed-price' },
  { label: 'Time Auction', key: 'auctions' },
]

const ExploreTemplate: FC = () => {
  // const params = useSearchParams()
  // const currentTabName = useMemo(() => params.get('tab') && params.get('tab'), [params])
  const { address } = getAccount(config)

  const [saleType, setSaleType] = useState<string>('all')
  const [sortType, setSortType] = useState<string>('recently_added')
  const [networkType, setNetworkType] = useState<string>('all')
  const sale_only = true

  const {
    ExploreData,
    ExploreIsFetching,
    ExploreIsLoading,
    exploreFetchNextPage,
    exploreHasNextPage,
    exploreIsFetchingNextPage,
  } = useExplore(address, sortType, 9, 1, saleType, networkType, sale_only)

  return (
    <div className="min-h-[50%] pb-[88px] pt-9">
      <div className="container mx-auto">
        <div>
          <div className="hidden gap-3">
            <Tab
              active={explorePageTabs[0].value}
              baseRoute="/explore"
              defaultTab={explorePageTabs[0].value}
              tabs={explorePageTabs}
            />
          </div>

          <div className="filters mt-4 flex w-full items-center justify-between">
            <div className="hidden items-center justify-center gap-2 rounded-full bg-[#F0F0F0] dark:bg-[#232323] smd:flex">
              {time.map(({ label, key }) => (
                <button key={key} onClick={() => setSaleType(key)}>
                  <Typography
                    className={`from-18.71% enabled:active:bg-brand-hover cursor-pointer rounded-full from-pink-400 to-pink-500 to-80% px-3 py-1 hover:bg-gradient-to-t hover:text-white disabled:opacity-30 ${key === saleType ? 'bg-gradient-to-t text-white' : ''}`}
                    size="paragraph"
                  >
                    {label}
                  </Typography>
                </button>
              ))}
            </div>

            <div className="block smd:hidden">
              <FilterDropDown
                child={time}
                isBorder={false}
                label={
                  <div>
                    <svg
                      fill="currentColor"
                      height="1em"
                      stroke="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 16 16"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M6 12v-1h4v1H6zM4 7h8v1H4V7zm10-4v1H2V3h12z"></path>
                    </svg>
                  </div>
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <Typography className="hidden lmd:block" size="lg">
                Filter by:
              </Typography>
              <div className="hidden items-center gap-2 lmd:flex">
                {filters.map(({ label, key, child, dropdownType }) => {
                  return (
                    <FilterDropDown
                      child={child}
                      dropdownType={dropdownType}
                      isBorder={!(key === 'sort')}
                      key={key}
                      label={label}
                      setNetworkType={setNetworkType}
                      setSortType={setSortType}
                    />
                  )
                })}
              </div>

              <div className="block lmd:hidden">
                {filters.slice(2, 3).map(({ label, key, child, dropdownType }) => {
                  return (
                    <FilterDropDown
                      child={child}
                      dropdownType={dropdownType}
                      isBorder={!(key === 'sort_by')}
                      key={key}
                      label={label}
                      position="right"
                      setNetworkType={setNetworkType}
                      setSortType={setSortType}
                    />
                  )
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 lmd:hidden">
            {filters.slice(0, 2).map(({ label, key, child, dropdownType }) => {
              return (
                <FilterDropDown
                  child={child}
                  dropdownType={dropdownType}
                  isBorder={!(key === 'sort_by')}
                  key={key}
                  label={label}
                  setNetworkType={setNetworkType}
                  setSortType={setSortType}
                />
              )
            })}
          </div>
          <div>
            {ExploreIsLoading && !exploreIsFetchingNextPage ? (
              <div className="mt-8 grid w-full grid-cols-1 gap-6 md:grid-cols-2 slg:grid-cols-3">
                <NftCardSkeleton variant="explore" />
                <NftCardSkeleton variant="explore" />
                <NftCardSkeleton variant="explore" />
              </div>
            ) : (
              <div className="mt-8 flex flex-col items-center justify-center gap-y-8">
                {ExploreData?.map((page: SearchResponse, i) => (
                  <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 slg:grid-cols-3" key={i}>
                    {page?.data?.map(asset => (
                      <NftCard
                        auctionDetails={asset.auctionDetails}
                        collectibleOwner={asset.collectibleOwner}
                        generatedImagePrompt={asset.generatedImagePrompt}
                        heading={asset.title}
                        id={asset.id}
                        isLike={!!asset.isLike}
                        isMinted={false}
                        isShowPromptPublicly={asset.isShowPromptPublicly}
                        key={asset.id}
                        network={asset?.networkId}
                        price={getNftPrice(asset)}
                        src={asset.previewUrl}
                        status={getSaleStatus(asset)}
                        subHeading={asset.description}
                        variant="explore"
                      />
                    ))}
                  </div>
                ))}
                {exploreIsFetchingNextPage && (
                  <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 slg:grid-cols-3">
                    <NftCardSkeleton variant="explore" />
                    <NftCardSkeleton variant="explore" />
                    <NftCardSkeleton variant="explore" />
                  </div>
                )}
              </div>
            )}

            {ExploreData &&
              ExploreData.map(item => item.data)
                .filter(item => item)
                .flat().length === 0 && (
                <Typography
                  className="flex min-h-[250px] w-full items-center justify-center text-center"
                  size="paragraph"
                >
                  No Record Found
                </Typography>
              )}

            <ScrollTrigger
              isLoading={ExploreIsFetching}
              onTrigger={() => {
                if (!ExploreIsLoading && !exploreIsFetchingNextPage && exploreHasNextPage) {
                  exploreFetchNextPage()
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExploreTemplate
