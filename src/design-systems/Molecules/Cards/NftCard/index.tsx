'use client'
import { FC, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import Card from '../Card'
import { PriceCard } from '../PriceCard/PriceCard'

import { NFTCardProps } from './interface'
import { getBorderRadius, getCardImageRadius, getImageSize } from './utils'

import Typography from '@/design-systems/Atoms/Typography'
import {
  CopyIcon,
  EthereumIcon,
  IconMinus,
  IconPlus,
  OutlineStarIcon,
  PolygonIcon,
  RedStarIcon,
} from '@/design-systems/Atoms/Icons/index'
import { useCopyTextMutation } from '@/hooks/useCopy'
import { useLike } from '@/hooks/ApiHooks/useLike'
import Button from '@/design-systems/Atoms/Button'
import { usePromptContext } from '@/context/PromptContext'
import { Timer } from '@/design-systems/Atoms/Timer'
import { useUserContext } from '@/context/UserContext'

const NftCard: FC<NFTCardProps> = ({
  src,
  className = '',
  heading = '',
  variant = 'explore',
  isSelected,
  onClick,
  isOtherSelected,
  isLike = false,
  id,
  price,
  network,
  tab,
  isMinted,
  auctionDetails,
  status,
  // isShowPromptPublicly,
  // generatedImagePrompt,
  isLink = true,
  saleType,
}) => {
  const [saleStatus, setSaleStatus] = useState<string | undefined>(status)
  const [like, setLike] = useState<boolean>(() => isLike)
  const { mutateAsync: copyAsync } = useCopyTextMutation()
  const { likeMutation } = useLike()
  const router = useRouter()
  const pathname = usePathname()
  const { address } = useAccount()
  const { setSelectedNft } = usePromptContext()
  const { signatureData } = useUserContext()

  const handleLike = () => {
    if (address) {
      likeMutation.mutate({ collectible_id: id })
      setLike(prev => !prev)
    } else {
      toast.error('Please connect to metamaks')
    }
  }

  const nftStatus = useMemo(() => {
    if (saleStatus === 'sold') {
      return <span className="font-RobotoCondensed text-xs md:text-paragraph">Sold</span>
    }
    if (saleStatus === 'listed' || saleStatus === 'future') {
      if (auctionDetails?.auctionType === '1') {
        return (
          <Typography className="!font-medium text-neutral-500" size="lg">
            Buy price
          </Typography>
        )
      }
      if (auctionDetails?.auctionType === '2' && new Date(auctionDetails?.startingTime) > new Date()) {
        return (
          <>
            <div className="block">
              <Timer
                endTime={new Date(auctionDetails.startingTime)}
                size="medium"
                status="pending"
                updateStatus={setSaleStatus}
              />
            </div>
            <Typography className="!font-medium text-neutral-500" size="lg">
              Bid Price
            </Typography>
          </>
        )
      } else if (auctionDetails?.auctionType === '2' && auctionDetails?.closingTime) {
        return (
          <>
            <div className="">
              <Timer endTime={new Date(auctionDetails.closingTime)} size="medium" updateStatus={setSaleStatus} />
            </div>
            <Typography className="!font-medium text-neutral-500" size="lg">
              Bid Price
            </Typography>
          </>
        )
      }
    }

    if (saleStatus === 'ended' && auctionDetails?.closingTime) {
      return <Timer endTime={new Date(auctionDetails.closingTime)} size="medium" status={saleStatus} />
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctionDetails?.auctionType, auctionDetails?.closingTime, saleStatus])

  return (
    <Link
      className={`h-full rounded-[44px] bg-transparent bg-gradient-to-t from-transparent to-transparent p-1 transition-all duration-500  ease-in-out ${variant === 'mint preview' || 'generated' ? '' : 'hover:from-pink-400 hover:to-pink-500'}`}
      href={isLink ? `/nft/${id}` : ''}
    >
      <div
        className={`dark:drop-shadow-card-dark group relative flex h-full w-[100%] ${variant === 'mint preview' ? 'cursor-default' : 'cursor-pointer'}  flex-col  items-center  border-[#D2D2D2] bg-neutral-800 shadow-card-shadow drop-shadow-card hover:shadow-hover-shadow ${variant === 'generated' || variant === 'mint preview' ? 'p-4' : 'p-6'}   ${variant === 'explore' ? 'dark:bg-gray-300' : 'dark:bg-neutral-300'}   ${className}  ${getBorderRadius(variant)}  ${variant === 'generated' && isSelected ? 'from-18.71% bg-gradient-to-t from-pink-400 to-pink-500 to-80%' : ''}`}
        onClick={
          !isLink
            ? e => {
                e.stopPropagation()
                e.preventDefault()
                onClick?.()
              }
            : undefined
        }
      >
        <div className=" knowledge-gallery-card relative  w-full  ">
          {variant !== 'mint preview' && (
            <div
              className="absolute  right-4 top-4 z-[8] flex h-[32px] w-[32px] cursor-default items-center justify-center  rounded-[50%] bg-white p-1"
              onClick={variant === 'explore' ? () => handleLike() : undefined}
            >
              {variant === 'example' && (
                <div onClick={() => copyAsync(heading)}>
                  <CopyIcon />
                </div>
              )}
              {variant === 'generated' && (isSelected ? <IconMinus /> : <IconPlus />)}
            </div>
          )}

          <div className={`relative ${variant === 'explore' ? 'mb-6' : ''}`}>
            <Card
              alt={'name'}
              className={`relative z-[7] rounded-xl object-contain transition ${variant === 'mint preview'} ? '' : 'group-hover:opacity-80'}  ${getImageSize(variant)}${getCardImageRadius(variant)} ${variant === 'explore' ? 'shadow-2xl' : ''}`}
              src={src as string}
            />
            <div className="absolute bottom-0 left-0 right-0 flex justify-center rounded-xl blur-[50px]">
              <Image
                alt="cardImage"
                className={`${variant === 'mint preview' ? 'cursor-default' : ''}`}
                height={150}
                src={src as string}
                width={245}
              />
            </div>
            {auctionDetails?.auctionType === '1' ? (
              <Typography className="from-18.71% timer_main_wrp absolute bottom-4 left-0 right-0 z-10 mx-auto hidden w-max items-center justify-center gap-1 rounded-xl bg-gradient-to-t from-pink-400 to-pink-500 to-80% px-6 py-2 text-lg font-bold text-white group-hover:flex">
                Buy Now
              </Typography>
            ) : (
              ''
            )}
            {!isSelected && isOtherSelected && (
              <div className="absolute left-0 top-0 z-50 h-full w-full bg-neutral-800 opacity-60 dark:bg-neutral-300"></div>
            )}
          </div>

          {variant === 'explore' && (
            <>
              <div className="absolute left-4 top-4 z-[8] flex h-[32px] w-[32px] cursor-pointer items-center justify-center  rounded-[50%] bg-white p-1">
                {network === '1' ? (
                  <EthereumIcon className="dark:!fill-neutral-100" />
                ) : (
                  <PolygonIcon className="dark:!fill-neutral-100" />
                )}
              </div>
              <div className="absolute  right-4 top-4 z-[8] flex h-[32px] w-[32px] cursor-pointer items-center justify-center  rounded-[50%] bg-white p-1">
                <div
                  onClick={e => {
                    e.preventDefault()
                    handleLike()
                    e.stopPropagation()
                  }}
                >
                  {like ? <RedStarIcon /> : <OutlineStarIcon />}
                </div>
              </div>
              <Typography
                className="w-full max-w-[300px] truncate text-left  capitalize text-neutral-100 dark:text-white"
                size="heading"
              >
                {heading}
              </Typography>
              {/* <Typography className=" card-description w-[95%] text-left" size="paragraph">
                {isShowPromptPublicly ? generatedImagePrompt : '-'}
              </Typography> */}
              <div className="flex w-full items-center justify-between">
                {!(tab === 'created' || (tab === 'collected' && saleType === 'false')) && (
                  <div className="mt-4 w-full">
                    {nftStatus}
                    {price?.label && price?.amount && (
                      <PriceCard label={price?.label} price={price?.amount} size="medium" token={price?.token} />
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {variant === 'example' && (
          <>
            <div className="mt-5 flex h-[23%] w-full max-w-full flex-col items-start justify-start  sm:text-center md:h-[20%]">
              <Typography
                className="w-full max-w-[300px] truncate text-left  capitalize text-neutral-100 dark:text-white"
                size="heading"
              >
                {heading}
              </Typography>
              {pathname.includes('/profile') && !isMinted && signatureData?.user?.id && (
                <Button
                  className="mt-2"
                  onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    setSelectedNft({ id: id || '', imageUrl: src as string })
                    router.push('/mint-nft')
                  }}
                >
                  Mint
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </Link>
  )
}
export default NftCard
