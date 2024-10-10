import { useEffect, useMemo, useRef, useState } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'

import { EthereumIcon, PolygonIcon } from '../Icons'
import Typography from '../Typography'
import Spinner from '../Spinner'

import { SwitchChianType } from './interface'

// Define your component
export const SwitchChainDropDown: React.FC<SwitchChianType> = ({
  isSignedData,
  signInWithEthereum,
  isChainDropdownOpen,
  setIsChainDropdownOpen,
}) => {
  const [selectedValue, setSelectedValue] = useState<number>()
  // State to manage the open/close state of the dropdown
  const [isOpen, setIsOpen] = useState<boolean>(isChainDropdownOpen || false)
  const [loading, setLoading] = useState<boolean>(false)

  const { chainId } = useAccount()
  const { chains, switchChain, status } = useSwitchChain()

  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    if (chainId) {
      setSelectedValue(chainId)
    }
  }, [chainId])

  const dropdownOptions = [
    {
      id: 2,
      label: 'Ethereum',
      value: chains[0].id,
      image: <EthereumIcon className="group-hover:fill-pink-500" />,
    },
    {
      id: 3,
      label: 'Polygon',
      value: chains[1].id,
      image: <PolygonIcon className="group-hover:fill-pink-500" />,
    },
  ]

  const handleOptionClick = async (value: number) => {
    setIsOpen(false)
    setIsChainDropdownOpen(false)
    switchChain({ chainId: value })
  }

  useMemo(() => {
    setIsOpen(isChainDropdownOpen)
  }, [isChainDropdownOpen])

  useEffect(() => {
    const handler = async () => {
      setLoading(true)
      try {
        if (status === 'success') {
          const res = await signInWithEthereum()
          if (res) {
            setSelectedValue(chainId)
          }
        }
      } catch (error) {
        console.error('Error signing in with Ethereum:', error)
      } finally {
        setLoading(false)
      }
    }
    handler()
  }, [status])

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Event handler for toggling the dropdown open/close state
  const toggleDropdown = () => {
    setIsOpen(prev => {
      setIsChainDropdownOpen(!prev)
      return !prev
    })
  }

  return (
    <div className="relative hidden lg:block" ref={dropdownRef}>
      <button
        className={`${isSignedData ? 'pointer-events-auto' : 'pointer-events-none'} flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800 dark:bg-neutral-400`}
        onClick={toggleDropdown}
      >
        {(selectedValue === chains[0].id && chainId === chains[0].id) || selectedValue === undefined ? (
          <>{loading ? <Spinner className="animate-spin" /> : <EthereumIcon />}</>
        ) : (
          <>{loading ? <Spinner className=" animate-spin" /> : <PolygonIcon />}</>
        )}
      </button>
      {/* <Spinner className="animate-spin" /> */}
      {/* Conditionally render the dropdown list based on the isOpen state */}
      {isOpen && (
        <div className="">
          <ul
            className={`absolute right-[-10px] z-[100] mt-3 w-[265px] gap-y-[40px]  rounded-t-sm bg-gradient-to-t from-pink-400 to-pink-500 to-80% pb-2 duration-300 ease-in-out ${
              isOpen ? 'max-h-60 overflow-y-auto' : 'max-h-0 overflow-hidden'
            }`}
          >
            {dropdownOptions.map(option => (
              <li
                className="item-center group flex cursor-pointer items-center gap-x-6 bg-white px-10 first:pt-10 last:pb-10 last:pt-9 group-hover:text-white dark:bg-[#212121] dark:text-neutral-400 "
                key={option.id}
                onClick={() => handleOptionClick(option.value)}
              >
                {/* Conditional rendering of icons */}
                {option.image}
                <Typography
                  className={`text-lg font-semibold text-light group-hover:text-neutral-100 dark:text-neutral-500 dark:group-hover:text-white`}
                >
                  {option.label}
                </Typography>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
