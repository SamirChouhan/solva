'use client'
import React, { useEffect, useMemo, useState } from 'react'
import moment from 'moment'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import Image from '@/design-systems/Atoms/Image'
import dummyBanner from '@/assets/images/image-new.png'
import Typography from '@/design-systems/Atoms/Typography'
import { useCollectionDetails } from '@/hooks/ApiHooks/useCollectionDetails'
import Skeleton from '@/design-systems/Atoms/Skeleton'
import { formatAddress } from '@/utils'

const CollectionUpperSection: React.FC = () => {
  const [isShowFullDesc, setIsShowFullDesc] = useState<boolean>(false)
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { data, isLoading } = useCollectionDetails(params.id)

  useEffect(() => {
    if (!data?.status && !isLoading) {
      router.push('/')
      toast.info('Collection does not exist!')
    }
  }, [data, router, isLoading])

  const collectionInfo = useMemo(() => {
    return [
      {
        label: 'items',
        value: data?.data.items,
      },
      {
        label: 'created',
        value: moment(data?.data.collectionsInfo?.createdOn).format('ll'),
      },
      {
        label: 'creator earnings',
        value: data?.data.collectionsInfo?.royalties,
      },

      {
        label: 'owners',
        value: data?.data?.owners,
      },
    ]
  }, [data])

  const bannerInsideInfo = useMemo(
    () => (
      <div className="container absolute bottom-4 z-10 mb-5 flex w-full flex-col justify-between xl:left-1/2 xl:-translate-x-1/2 xl:flex-row xl:items-center">
        <div className="left">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-8">
            <div className="image-wrp h-28 w-28 xl:mx-auto">
              {data?.data.collectionsInfo?.image ? (
                <Image
                  alt="collection image"
                  className="overflow-hidden rounded-full border-[4px] border-pink-500"
                  height={2000}
                  src={data?.data.collectionsInfo?.image}
                  styles={`h-full w-full object-cover`}
                  width={2000}
                />
              ) : (
                <div className="h-full w-full rounded-full border-[4px] border-pink-500 bg-neutral-800 dark:bg-neutral-200"></div>
              )}
            </div>
            <div>
              <Typography className="text-white" size="title">
                {data?.data?.collectionsInfo?.displayName}
              </Typography>
              <Typography className="font-semibold" size="paragraph">
                {formatAddress(data?.data.collectionsInfo?.walletAddress || '')}
              </Typography>
            </div>
          </div>
        </div>

        <div className="separator my-2 h-[1px] w-full bg-neutral-700 dark:bg-neutral-300 xl:hidden"></div>

        <div className="right">
          <div className="flex w-full gap-12">
            <div className="flex flex-col items-center">
              <Typography className="text-small text-white sm:text-heading" size="heading">
                {data?.data.totalVolume?.toFixed(2)}
              </Typography>
              <Typography className="text-sm sm:text-paragraph" size="paragraph">
                Total Volume
              </Typography>
            </div>

            <div className="flex flex-col items-center">
              <Typography className="text-small text-white sm:text-heading" size="heading">
                {data?.data.floorPrice?.toFixed(2)} SOL
              </Typography>
              <Typography className="text-sm sm:text-paragraph" size="paragraph">
                Floor Price
              </Typography>
            </div>

            <div className="flex flex-col items-center">
              <Typography className="text-small text-white sm:text-heading" size="heading">
                -
              </Typography>
              <Typography className="text-sm sm:text-paragraph" size="paragraph">
                Best Offer
              </Typography>
            </div>
          </div>
        </div>
      </div>
    ),
    [data]
  )

  if (isLoading || !data?.status) {
    return (
      <div className="relative">
        <Skeleton className="mb-5 !h-[350px]" />
        <div className="container">
          <div className="mt-12">
            <Skeleton className="mb-4 !h-2 w-full rounded md:!w-[40%]" />
            <Skeleton className="!h-2 w-[90%] rounded md:!w-[30%]" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="banner relative h-[350px]">
        <div className="absolute inset-0 z-0">
          <Image
            alt="collection image"
            className="w-full overflow-hidden"
            height={1000}
            src={data?.data.collectionsInfo.bannerImage || dummyBanner}
            styles={`h-full w-full object-cover`}
            width={1000}
          />
        </div>
        <div className="block">{bannerInsideInfo}</div>
        <div className="absolute inset-0 bg-[linear-gradient(0deg,_#141414,_transparent)]"></div>
      </div>

      <div className="container mt-12">
        <Typography className="w-full text-paragraph xl:w-[40%]">
          {isShowFullDesc ? (
            <>
              {data?.data.collectionsInfo.description}{' '}
              <span className="cursor-pointer font-semibold" onClick={() => setIsShowFullDesc(false)}>
                Show Less...
              </span>{' '}
            </>
          ) : (
            <>
              {data?.data.collectionsInfo.description.slice(0, 50)}{' '}
              {data?.data.collectionsInfo.description && data?.data.collectionsInfo.description.length > 50 && (
                <span className="cursor-pointer font-semibold" onClick={() => setIsShowFullDesc(true)}>
                  Show More...
                </span>
              )}{' '}
            </>
          )}
        </Typography>
        <div className="mt-4 flex flex-col gap-2 md:mt-auto md:flex-row">
          {collectionInfo.map((item, index) => (
            <div className="flex items-center justify-between gap-2 text-neutral-400 dark:text-neutral-500" key={index}>
              <Typography className="text-paragraph capitalize">{item.label}</Typography>
              <Typography className="text-paragraph font-bold">{item.value}</Typography>
              {index !== collectionInfo.length - 1 && (
                <div className="hidden h-1 w-1 rounded-full bg-neutral-400 dark:bg-neutral-500 md:block"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CollectionUpperSection
