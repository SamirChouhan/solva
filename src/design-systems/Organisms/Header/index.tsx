'use client'
import { createWeb3Modal, useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAccount, useDisconnect, useSignMessage } from 'wagmi'
import { mainnet, polygon, polygonAmoy, sepolia } from 'viem/chains'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { setCookie, deleteCookie, getCookie } from 'cookies-next'
import Link from 'next/link'
import { isMobile } from 'react-device-detect'

import eatheriumIcon from '../../../assets/images/ethereumIcon.svg'

import MobileHeader from './MobileHeader'
import { ThemeMode } from './interface'

import { config, projectId } from '@/context/wagmiContext/config'
import Button from '@/design-systems/Atoms/Button'
import { CrossIcon, HumberIcon, MoonIcon, SearchIcon } from '@/design-systems/Atoms/Icons'
import LogoBlack from '@/assets/images/logoblack.png'
import LogoWhite from '@/assets/images/logowhite.png'
import Typography from '@/design-systems/Atoms/Typography'
import { useGetNonce } from '@/hooks/ApiHooks/useGetNonce'
import { useGetSignature } from '@/hooks/ApiHooks/useGetSignature'
import { NonceResponse, SignatureResponse } from '@/api-services/interfaces/auth'
import { SwitchChainDropDown } from '@/design-systems/Atoms/SwitchChainDropeDown'
import Spinner from '@/design-systems/Atoms/Spinner'
import sunIcon from '@/assets/images/icons/sunIcon.png'
import { useUserContext } from '@/context/UserContext'
import Input from '@/design-systems/Atoms/Input'
import HeaderSearchDropdown from '@/design-systems/Atoms/HeaderSearchDropdown'
import { useHeaderSearch } from '@/hooks/ApiHooks/useHeaderSearch'
import { UserProfileDropDown } from '@/design-systems/Atoms/UserProfileDropdown'
import { useToggle } from '@/hooks'
import { SignatureData } from '@/context/UserContext/interface'
import { useUserData } from '@/hooks/ApiHooks/useUserData'
import { IS_PRODUCTION, getTotalCredit } from '@/utils'

export const ercData = [
  {
    id: 1,
    name: 'ERC-1122',
    value: 'Ethereum',
    image: eatheriumIcon,
  },
  {
    id: 2,
    name: 'ERC-1155',
    value: 'Polygon',
    image: eatheriumIcon,
  },
]

const Header: React.FC = () => {
  const { setTheme, theme } = useTheme()
  const [isMounted, setIsMounted] = useState<boolean>(false)
  if (!projectId) throw new Error('Project ID is not defined')

  const [isSignedData, setIsSignedData] = useState<boolean>(false)
  const [isSignedMessage, setisSignedMessage] = useState<boolean>(false)
  const { setSignatureData, remainingCredit, isLoadUser } = useUserContext()
  const [searchValue, setSearchValue] = useState<string>('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [mobileHeader, setMobileHeader] = useState<boolean>(false)
  const [chainDropdown, setChainDropdown] = useState<boolean>(false)
  const [profileDropdown, setProfileDropdown] = useState<boolean>(false)
  const [isShowBuyButton, setIsShowBuyButton] = useState<boolean>(false)

  const pathName = usePathname()
  const router = useRouter()

  const [mobileSearch, , , turnOnMobileSearch, turnOffMobileSearch] = useToggle()

  const mobileSpecificWalletId = 'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96'
  const otherWalletIds = [
    'e7c4d26541a7fd84dbdfa9922d3ad21e936e13a7a0e44385d44f006139e44d3b',
    'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',
  ]

  // Modify the wallet IDs based on device type
  const includeWalletIds = isMobile ? [...otherWalletIds, mobileSpecificWalletId] : otherWalletIds
  // createWeb3Modal modal
  createWeb3Modal({
    themeMode: theme as ThemeMode,
    themeVariables: {
      '--w3m-font-family': 'Poppins, sans-serif',
      '--w3m-font-size-master': '11px',
    },
    wagmiConfig: config,
    allWallets: 'HIDE',
    projectId,
    enableAnalytics: true,
    includeWalletIds: includeWalletIds,
  })

  const { open } = useWeb3Modal()
  const openCheck = useWeb3ModalState()
  const { disconnect } = useDisconnect()
  const { signMessageAsync } = useSignMessage()
  const { isConnecting, address, chainId } = useAccount()
  const { refetchUserData } = useUserData(address)
  const { nonceMutateAsync } = useGetNonce()
  const { signatureMutateAsync } = useGetSignature()
  const { searchMutateAsync, searchResponse } = useHeaderSearch()

  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobileNavRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false)
    }
    if (mobileNavRef.current && !mobileNavRef.current.contains(event.target as Node)) {
      setMobileHeader(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const signInWithEthereum = useCallback(
    async function () {
      try {
        const nonceReq = {
          wallet_address: String(address),
          network_id: String(chainId),
        }
        const nonceRes: NonceResponse = await nonceMutateAsync(nonceReq)
        if (!nonceRes) {
          throw new Error('Failed to get nonce!')
        }
        setisSignedMessage(true)
        const signature = await signMessageAsync({ message: nonceRes.data })

        const signatureReq = {
          nonce: nonceRes.data,
          signature,
          network_id: String(chainId),
          wallet_type: 'METAMASK',
        }
        const signatureRes: SignatureResponse = await signatureMutateAsync(signatureReq)
        if (!signatureRes) {
          throw new Error('Failed to get signatureRes!')
        }

        refetchUserData()
        setIsSignedData(true)
        setCookie('isSignedData', true)
        setCookie('token', signatureRes?.data?.token, {
          expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
        })
        setSignatureData(signatureRes?.data)
      } catch (err) {
        disconnect()
        setIsSignedData(false)
        setisSignedMessage(false)
        deleteCookie('token')
        deleteCookie('isSignedData')
        setSignatureData({} as SignatureData)
      }
    },
    [
      address,
      chainId,
      disconnect,
      nonceMutateAsync,
      refetchUserData,
      setSignatureData,
      signMessageAsync,
      signatureMutateAsync,
    ]
  )

  useEffect(() => {
    const handler = async () => {
      await signInWithEthereum()
    }
    if (IS_PRODUCTION) {
      if (chainId === mainnet.id || chainId === polygon.id) {
        if (address && !isSignedData) {
          handler()
        }
      }
    } else {
      if (chainId === sepolia.id || chainId === polygonAmoy.id) {
        if (address && !isSignedData) {
          handler()
        }
      }
    }
  }, [chainId, address, isSignedData, signInWithEthereum])

  useEffect(() => {
    if (openCheck.open) {
      const body = document.querySelector('body')
      if (body !== null) {
        body.classList.add('web3ModalOpen')
      }
      // for adding css in connectwallet modal
      const getName = document.getElementsByTagName('w3m-modal')
      const getChildName: any = getName[0]?.renderRoot.childNodes[2].childNodes[1]

      const getSwitchNam = getChildName?.getElementsByTagName('w3m-header')[0].renderRoot.childNodes[2]
      // Assuming getName is a function that returns an object with the provided structure
      const getNameResult = getSwitchNam?.getElementsByTagName('wui-text')[0].innerHTML

      const getCloseIcon = getSwitchNam?.getElementsByTagName('wui-icon-link')[1]
      // Check if the result contains the text "Switch Network"
      if (getNameResult?.includes('Switch Network')) {
        getCloseIcon.style.visibility = 'hidden'
      }
      if (getChildName?.nodeType === Node.ELEMENT_NODE) {
        const elementNode = getChildName as HTMLElement
        elementNode.style.maxWidth = '480px'
        elementNode.style.boxShadow = '0px 4px 64px 0px rgba(108, 107, 107, 0.12)'
        elementNode.style.outline = 'none'
        elementNode.style.pointerEvents = 'auto'
      }
    } else {
      const body = document.querySelector('body')
      if (body !== null) {
        body?.classList.remove('web3ModalOpen')
      }
    }
  }, [openCheck.open])

  const OpenWallet = () => {
    open()
    setIsSignedData(false)
    deleteCookie('isSignedData')
  }

  useEffect(() => {
    const data = getCookie('isSignedData')
    if (data === 'true') {
      setIsSignedData(true)
    }

    setIsMounted(true)
  }, [])

  const handleDisconnect = () => {
    disconnect()
    setIsSignedData(false)
    setisSignedMessage(false)
    deleteCookie('isSignedData')
    setSignatureData({} as SignatureData)
    deleteCookie('token')
    router.push('/')
  }

  const handleTheme = () => {
    theme === 'dark' ? setTheme('light') : setTheme('dark')
  }

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
    const req = {
      search: e.target.value,
    }
    searchMutateAsync(req)
  }

  const handleInputFocus = () => {
    setIsDropdownOpen(true)
  }

  const handleProfileDropdown = (value: boolean) => {
    setProfileDropdown(value)
    setChainDropdown(false)
  }
  const handleChainDropdown = (value: boolean) => {
    setChainDropdown(value)
    setProfileDropdown(false)
  }

  return (
    <header
      className={`${mobileSearch && 'bg-white dark:bg-[#212121]'} relative flex items-center py-[14px] smd:h-[102px] smd:pb-[18px] smd:pt-6`}
    >
      <div className="container">
        <div className="flex w-full items-center justify-between gap-3">
          {/* left section */}
          {mobileSearch ? (
            <div className="flex h-[30px] w-full items-center justify-between smd:h-[57px]" ref={dropdownRef}>
              <div className="flex w-full flex-row items-center justify-center gap-2">
                <SearchIcon className="!h-[16px] !w-[16px] smd:!h-[24px] smd:!w-[24px]" />
                <Input
                  inWrpClassName="bg-transparent  border-0 p-0  "
                  inputClassNames="!p-0"
                  placeholder="Search by name"
                  type="text"
                  value={searchValue}
                  onChange={handleSearch}
                  onFocus={handleInputFocus}
                />
              </div>
              {isDropdownOpen && <HeaderSearchDropdown searchResponse={searchResponse ?? searchResponse} />}
              <div onClick={() => turnOffMobileSearch()}>
                <CrossIcon className=" !h-[16px] !w-[16px] smd:!h-[24px] smd:!w-[24px]" />
              </div>
            </div>
          ) : (
            <>
              <div className="flex w-[32%] items-center gap-6 slg:w-[52%]  xl:gap-10">
                <Link href={'/'}>
                  {isMounted && theme && theme === 'dark' ? (
                    <Image
                      alt="logo"
                      className="h-[29px] w-[94px] smd:h-[41px] smd:w-[123px] "
                      height={31}
                      src={LogoWhite}
                    />
                  ) : (
                    <Image
                      alt="logo"
                      className="h-[29px] w-[94px] smd:h-[41px]  smd:w-[123px]"
                      height={31}
                      src={LogoBlack}
                    />
                  )}
                </Link>
                {/* search */}
                <div className="group relative hidden  w-[65%] slg:block" ref={dropdownRef}>
                  <div className="dark:group-focus-within:border-[rgba(196,  51, 255,  0.32)] relative z-[100] flex w-[100%] items-center !rounded-lg border-2 border-solid border-neutral-600 group-focus-within:border-2 group-focus-within:border-customColor group-focus-within:bg-white dark:border-neutral-300 dark:group-focus-within:bg-[#212121] ">
                    <SearchIcon className="] ml-[24px]" />
                    <Input
                      inWrpClassName="bg-transparent dark:neutral-100 border-none"
                      inputStyle="py-[14px] px-[16px] bg-image-one bg-leftCenter !rounded-r-lg bg-no-repeat"
                      placeholder="Search by name"
                      type="text"
                      value={searchValue}
                      onChange={handleSearch}
                      onFocus={handleInputFocus}
                    />
                  </div>
                  {isDropdownOpen && <HeaderSearchDropdown searchResponse={searchResponse ?? searchResponse} />}
                </div>
              </div>
              {/* right sectio */}
              <div className="flex w-[68%]  items-center justify-end gap-[16px]  lmd:w-[48%] slg:gap-[24px] xl:gap-[28px]">
                <Link href={'/'}>
                  <Typography
                    className={`hidden cursor-pointer font-semibold hover:text-[#141414] dark:text-white lg:block  ${pathName === '/' && 'text-[#141414]'}`}
                    size="paragraph"
                  >
                    Generate
                  </Typography>
                </Link>
                <Link href={'/explore'}>
                  <Typography
                    className=" hidden cursor-pointer font-semibold hover:text-[#141414] dark:text-white lg:block"
                    size="paragraph"
                  >
                    Explore
                  </Typography>
                </Link>
                <div
                  onMouseEnter={() => {
                    setIsShowBuyButton(true)
                  }}
                  onMouseLeave={() => {
                    setIsShowBuyButton(false)
                  }}
                >
                  {!isShowBuyButton ? (
                    <>
                      {isSignedData && (
                        <Typography
                          className="shadow-outlined-pink-500 active:shadow-outlined-pink-500 hidden min-w-[125px] cursor-pointer flex-nowrap items-center gap-1 rounded-3xl border border-pink-500 px-[18px] py-[8px] font-semibold dark:text-white md:flex"
                          size="paragraph"
                        >
                          Credit{' '}
                          {isLoadUser ? (
                            <div className="h-4 w-full animate-pulse rounded bg-neutral-600"></div>
                          ) : (
                            remainingCredit
                          )}
                        </Typography>
                      )}
                    </>
                  ) : (
                    <Link href={'/pricing'}>
                      <Button className="min-w-[125px]">Upgrade</Button>
                    </Link>
                  )}
                </div>
                <SwitchChainDropDown
                  isChainDropdownOpen={chainDropdown}
                  isSignedData={isSignedData}
                  setIsChainDropdownOpen={handleChainDropdown}
                  signInWithEthereum={signInWithEthereum}
                />
                {/* dark light mode */}
                {isMounted && (
                  <div
                    className=" hidden h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-neutral-800  dark:bg-neutral-400 xxl:flex"
                    onClick={handleTheme}
                  >
                    {theme === 'dark' ? <Image alt="icon" src={sunIcon} /> : <MoonIcon />}
                  </div>
                )}
                {isMounted && (
                  <div
                    className="flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-full bg-neutral-800 dark:bg-neutral-400 smd:h-12 smd:w-12 slg:hidden"
                    onClick={() => turnOnMobileSearch()}
                  >
                    <SearchIcon className="!h-[14px ] !w-[14px] smd:!h-[24px] smd:!w-[24px]" />
                  </div>
                )}
                {/* Connect Wallet button */}
                {isSignedData ? (
                  <div className="flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-full bg-neutral-800 dark:bg-neutral-400 smd:h-12 smd:min-w-12">
                    <UserProfileDropDown
                      handleDisconnect={handleDisconnect}
                      isProfileDropdownOpen={profileDropdown}
                      setIsProfileDropdownOpen={handleProfileDropdown}
                    />
                  </div>
                ) : (
                  <Button
                    className="font-Poppins lmd-!px-6 lmd-!py-4 hidden w-[220px] border-none !px-4 text-base font-semibold text-white md:block lmd:w-[191px]"
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
                <div
                  className="mobile_nv-btn lg:hidden"
                  ref={mobileNavRef}
                  onClick={() => setMobileHeader(prev => !prev)}
                >
                  <HumberIcon className="h-[16px] w-[19px]  cursor-pointer smd:h-[32px] smd:w-[32px]" />
                </div>
                {mobileHeader && (
                  <MobileHeader
                    OpenWallet={OpenWallet}
                    isConnecting={isConnecting}
                    isOpen={mobileHeader}
                    isSignedMessage={isSignedData}
                    openCheck={openCheck}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
