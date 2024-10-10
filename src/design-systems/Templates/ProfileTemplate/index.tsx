'use client'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import { useSearchParams, useParams } from 'next/navigation'
import Link from 'next/link'
import { FaDiscord, FaLink, FaInstagram } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

import Typography from '@/design-systems/Atoms/Typography'
import Tab from '@/design-systems/Atoms/Tabs'
import { CHAIN_ID, formatAddress, profilePageTabs } from '@/utils'
import NftCardList from '@/design-systems/Organisms/Profile/NftCardList'
import { useProfileTab } from '@/hooks/ApiHooks/useProfileTab'
import { ScrollTrigger } from '@/design-systems/Atoms/ScrollTrigger'
import { CopyIcon, EthereumIcon, PolygonIcon } from '@/design-systems/Atoms/Icons'
import { useUserContext } from '@/context/UserContext'
import { useCopyTextMutation } from '@/hooks/useCopy'
import ProfileImage from '@/design-systems/Molecules/ProfileImage'
import { AddressString } from '@/interfaces'
import { useUserData } from '@/hooks/ApiHooks/useUserData'
import Spinner from '@/design-systems/Atoms/Spinner'

const sale = [
  { label: 'On Sale', value: 'true' },
  { label: 'Off Sale', value: 'false' },
]

const ProfileTemplate: FC = () => {
  const { address, chainId } = useAccount()
  const { signatureData } = useUserContext()
  const { get } = useSearchParams()
  const { mutateAsync: copyAsync } = useCopyTextMutation()
  const params = useParams<{ address: AddressString }>()
  const router = useRouter()
  const [saleType, setSaleType] = useState<string>('true')
  const [isShowFullBio, setIsShowFullBio] = useState<boolean>(false)

  const tabs = useMemo(() => {
    return profilePageTabs.filter(item => {
      const privateKey = ['generated', 'favourites']
      if (privateKey.includes(item.value) && params.address.toLowerCase() !== signatureData.user?.walletAddress)
        return false
      return true
    })
  }, [params.address, signatureData.user?.walletAddress])

  const tab = useMemo(() => get('tab') || '', [get])

  const { profileTabQuery } = useProfileTab(
    tab || tabs[0].value,
    3,
    1,
    params.address,
    signatureData?.user?.id,
    saleType
  )

  const user = useUserData(params.address)

  useEffect(() => {
    if (!user.isLoadingUserData && !user?.userData) {
      toast.info('User not found')
      router.push('/')
    }
  }, [user, router])

  if (user.isLoadingUserData)
    return (
      <div className="my-14 flex w-full items-center justify-center">
        <Spinner className="h-[36px] w-[36px] animate-spin" />
      </div>
    )

  return (
    <div className="mt-20">
      <div className="container mx-auto">
        <div className="flex flex-col justify-center">
          <div className="item-center flex flex-col items-center justify-center gap-4 ">
            <div className="flex select-none flex-col items-center justify-center gap-4">
              <ProfileImage
                isActive={params.address.toLowerCase() === signatureData.user?.walletAddress}
                userImage={user?.userData?.image}
              />
              {params.address.toLowerCase() === signatureData.user?.walletAddress && (
                <Typography className="cursor-pointer text-center text-paragraph font-medium text-neutral-400">
                  <Link href={`/setting`}>Edit Profile</Link>
                </Typography>
              )}
            </div>

            <div className="flex items-center justify-normal gap-3">
              {address && <> {chainId === CHAIN_ID.etherum ? <EthereumIcon /> : <PolygonIcon />}</>}
              <div className="flex items-center justify-normal gap-3" onClick={() => copyAsync(params?.address)}>
                <Typography
                  className="cursor-pointer !font-bold !text-neutral-100 dark:!text-neutral-800"
                  size="paragraph"
                  variant="regular"
                >
                  {formatAddress(params?.address)}
                </Typography>
                <CopyIcon className="cursor-pointer stroke-[#04091E] dark:stroke-neutral-800" />
              </div>
            </div>

            <div className="mx-auto w-3/4">
              <Typography className="text-center" size="paragraph">
                {isShowFullBio ? user?.userData?.bio : user?.userData?.bio?.slice(0, 100)}
                {user?.userData?.bio && user?.userData?.bio.length > 100 && (
                  <>
                    ...
                    <span
                      className="cursor-pointer text-black dark:text-white"
                      onClick={() => setIsShowFullBio(prev => !prev)}
                    >
                      {isShowFullBio ? 'Show Less' : 'Show More'}
                    </span>
                  </>
                )}
              </Typography>
            </div>

            <div className="flex gap-6">
              {user.userData?.portfolio && (
                <Link
                  className={`"relative rounded-full bg-white px-4 py-4 text-heading`}
                  href={user.userData?.portfolio || '/'}
                  target="_blank"
                >
                  <FaLink className="text-black" />
                </Link>
              )}
              {user.userData?.twitterUrl && (
                <Link
                  className={`"relative rounded-full bg-white px-4 py-4 text-heading`}
                  href={user.userData?.twitterUrl || '/'}
                  target="_blank"
                >
                  <FaXTwitter className="text-black" />
                </Link>
              )}
              {user.userData?.discordUrl && (
                <Link
                  className={`"relative rounded-full bg-white px-4 py-4 text-heading`}
                  href={user.userData?.discordUrl || '/'}
                  target="_blank"
                >
                  <FaDiscord className="text-black" />
                </Link>
              )}
              {user.userData?.instagramUrl && (
                <Link
                  className={`"relative rounded-full bg-white px-4 py-4 text-heading`}
                  href={user.userData?.instagramUrl || '/'}
                  target="_blank"
                >
                  <FaInstagram className="text-black" />
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="mt-20">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <Tab
              active={tab}
              baseRoute={`/profile/${params.address}`}
              className="mb-4"
              defaultTab={tab || tabs[0].value}
              tabs={tabs}
            />

            {tab === 'collected' && (
              <div className="flex items-center justify-center gap-2 rounded-full bg-[#F0F0F0] dark:bg-[#232323]">
                {sale.map(({ label, value }) => (
                  <button key={value} onClick={() => setSaleType(value)}>
                    <Typography
                      className={`from-18.71% enabled:active:bg-brand-hover cursor-pointer rounded-full from-pink-400 to-pink-500 to-80% px-3 py-1 hover:bg-gradient-to-t hover:text-white disabled:opacity-30 ${value === saleType ? 'bg-gradient-to-t text-white' : ''}`}
                      size="paragraph"
                    >
                      {label}
                    </Typography>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="mb-8 mt-8 flex flex-col items-center justify-center gap-y-8">
            <NftCardList
              data={profileTabQuery.data
                ?.map(item => item.data)
                .flat()
                .filter(item => !!item)}
              isFetching={profileTabQuery.isFetching}
              isLoading={profileTabQuery.isLoading}
              tab={tab || tabs[0].value}
            />

            <ScrollTrigger
              isLoading={profileTabQuery.isFetching}
              onTrigger={() => {
                if (!profileTabQuery.isLoading && !profileTabQuery.isFetchingNextPage && profileTabQuery.hasNextPage) {
                  profileTabQuery.fetchNextPage()
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileTemplate
