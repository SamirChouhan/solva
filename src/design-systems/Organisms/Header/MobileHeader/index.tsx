import React, { FC, useEffect, useState } from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import Link from 'next/link'

import { MobileHeaderProps } from './interface'

import Typography from '@/design-systems/Atoms/Typography'
import { MoonIcon } from '@/design-systems/Atoms/Icons'
import sunIcon from '@/assets/images/icons/sunIcon.png'
import { useUserContext } from '@/context/UserContext'
import Button from '@/design-systems/Atoms/Button'
import Spinner from '@/design-systems/Atoms/Spinner'

const MobileHeader: FC<MobileHeaderProps> = ({ isOpen, isSignedMessage, OpenWallet, isConnecting, openCheck }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const { setTheme, theme } = useTheme()
  const { remainingCredit, isLoadUser } = useUserContext()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleTheme = () => {
    theme === 'dark' ? setTheme('light') : setTheme('dark')
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div
      className={` !overflow- fixed left-0 top-[56px]  z-[9] h-screen w-screen bg-neutral-100/80 backdrop-blur-sm  delay-0 duration-200 ease-in-out   dark:bg-neutral-200/80 smd:top-[102px]  `}
    >
      <div
        className={`fixed right-0 top-0 flex  h-full w-full flex-col  items-center  justify-start gap-6 bg-pink-900  p-6 dark:bg-neutral-300 md:w-[520px]   `}
      >
        {/* SwitchChainDropeDown */}

        {/* dark light mode */}
        {isSignedMessage && isMounted && (
          <Typography
            className="shadow-outlined-pink-500 active:shadow-outlined-pink-500 flex min-w-[125px] cursor-pointer flex-nowrap items-center justify-center gap-1 rounded-3xl border border-pink-500 py-[8px] font-semibold dark:text-white"
            size="paragraph"
          >
            Credit{' '}
            {isLoadUser ? <div className="h-4 w-full animate-pulse rounded bg-neutral-600"></div> : remainingCredit}
          </Typography>
        )}
        {isMounted && (
          <div
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-neutral-800 dark:bg-neutral-400 "
            onClick={handleTheme}
          >
            {theme === 'dark' ? <Image alt="icon" src={sunIcon} /> : <MoonIcon />}
          </div>
        )}
        <Link href={'/'}>
          <Typography className=" cursor-pointer font-semibold hover:text-[#141414] dark:text-white " size="subtitle">
            Generate
          </Typography>
        </Link>
        <Link href={'/explore'}>
          <Typography className="  cursor-pointer font-semibold hover:text-[#141414] dark:text-white " size="subtitle">
            Explore
          </Typography>
        </Link>
        {!isSignedMessage && (
          <Button
            className="font-Poppins block w-[191px] border-none px-7 py-3 text-base font-semibold text-white md:hidden"
            disabled={isSignedMessage}
            id="connectWalletBtn"
            onClick={OpenWallet}
          >
            {isConnecting && openCheck.open ? (
              <>
                <Spinner className="animate-spin" />
                Connecting...
              </>
            ) : (
              'Connect Wallet'
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

export default MobileHeader
