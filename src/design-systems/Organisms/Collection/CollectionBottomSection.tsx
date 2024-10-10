'use client'

import React, { useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { useAccount } from 'wagmi'

import { filters, tabOptions, time } from './utils'
import CollectionCardList from './CollectionCardList'
import CollectionActivityTable from './CollectionActivityTable'

import Tab from '@/design-systems/Atoms/Tabs'
import FilterDropDown from '@/design-systems/Atoms/DropDown/FiterDropdown'
import Typography from '@/design-systems/Atoms/Typography'
import { SearchIcon } from '@/design-systems/Atoms/Icons'
import Input from '@/design-systems/Atoms/Input'
import { useCollectionItemsAndActivity } from '@/hooks/ApiHooks/useCollectionItemsAndActivity'
import { useExplore } from '@/hooks/ApiHooks/useExplore'
import useDebounce from '@/hooks/useDebounce'

const CollectionBottomSection: React.FC = () => {
  const { get } = useSearchParams()
  const params = useParams<{ id: string }>()
  const { address } = useAccount()
  const tabs = useMemo(() => {
    return tabOptions
  }, [])
  const tab = useMemo(() => get('tab') || '', [get])
  const [saleType, setSaleType] = useState<string>('')
  const [sortType, setSortType] = useState<string>('recently_added')
  const [networkType, setNetworkType] = useState<string>('')
  const [search, setSearch] = useState<string>('')
  const debounceSearch = useDebounce(search, 300)

  const {
    ExploreData,
    ExploreIsFetching,
    ExploreIsLoading,
    exploreFetchNextPage,
    exploreHasNextPage,
    exploreIsFetchingNextPage,
  } = useExplore(address, sortType, 9, 1, saleType, networkType, false, params.id, debounceSearch)

  const { data, isLoading, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } = useCollectionItemsAndActivity(
    params.id,
    saleType,
    networkType
  )

  return (
    <div className="container mb-4">
      <Tab
        active={tab}
        baseRoute={`/collection/${params.id}`}
        className="mb-4"
        defaultTab={tab || tabs[0].value}
        tabs={tabs}
        isBgTabs={true}
      />

      {(tab || tabs[0].value) === 'items' && (
        <div>
          <div className="filters mt-4 flex w-full items-center justify-between">
            <div className="hidden items-center justify-center gap-2 rounded-full lg:flex">
              {time.map(({ label, key }) => (
                <button key={key} onClick={() => setSaleType(key)}>
                  <Typography
                    className={`from-18.71% enabled:active:bg-brand-hover cursor-pointer rounded-full from-pink-400 to-pink-500 to-80% px-3 py-1 hover:bg-gradient-to-t hover:bg-clip-text hover:text-transparent disabled:opacity-30 ${key === saleType ? 'bg-gradient-to-t bg-clip-text text-transparent' : ''}`}
                    size="paragraph"
                  >
                    {label}
                  </Typography>
                </button>
              ))}
            </div>

            <div className="block lg:hidden">
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
              <div className="hidden items-center gap-2 lmd:flex">
                {filters.map(({ label, key, child, dropdownType }) => {
                  return (
                    <FilterDropDown
                      child={child}
                      dropdownType={dropdownType}
                      key={key}
                      label={label}
                      setNetworkType={setNetworkType}
                      setSortType={setSortType}
                    />
                  )
                })}
              </div>

              <div className="flex flex-row items-center justify-center gap-2 rounded-md border border-neutral-600 px-5 py-1">
                <SearchIcon className="!h-[16px] !w-[16px] smd:!h-[24px] smd:!w-[24px]" />
                <Input
                  inWrpClassName="bg-transparent border-0 p-0"
                  inputClassNames="!p-0"
                  inputDirectWrp="!rounded-none"
                  placeholder="Search by name"
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.currentTarget.value)}
                />
              </div>

              <div className="block lmd:hidden">
                {filters.slice(2, 3).map(({ label, key, child, dropdownType }) => {
                  return (
                    <FilterDropDown
                      child={child}
                      dropdownType={dropdownType}
                      isBorder={!(key === 'sort')}
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
                  isBorder={!(key === 'sort')}
                  key={key}
                  label={label}
                  setNetworkType={setNetworkType}
                  setSortType={setSortType}
                />
              )
            })}
          </div>
        </div>
      )}
      <div className="my-4">
        {(tab || tabs[0].value) === 'items' ? (
          <CollectionCardList
            data={ExploreData?.map(item => item.data)
              .flat()
              .filter(nft => !!nft)}
            fetchNextPage={exploreFetchNextPage}
            hasNextPage={exploreHasNextPage}
            isFetching={ExploreIsFetching}
            isFetchingNextPage={exploreIsFetchingNextPage}
            isLoading={ExploreIsLoading}
          />
        ) : (
          <CollectionActivityTable
            data={data}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetching={isFetching}
            isFetchingNextPage={isFetchingNextPage}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  )
}

export default CollectionBottomSection
