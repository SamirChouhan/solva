import { useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useAccount } from 'wagmi'

import { UserProfileIcon } from '../Icons'
import Typography from '../Typography'
import Toggle from '../Toggle'

import { UserProfileType } from './interface'

// Define your component
export const UserProfileDropDown: React.FC<UserProfileType> = ({
  handleDisconnect,
  setIsProfileDropdownOpen,
  isProfileDropdownOpen,
}) => {
  // State to manage the open/close state of the dropdown
  const [isOpen, setIsOpen] = useState<boolean>(() => isProfileDropdownOpen || false)
  const { theme, setTheme } = useTheme()
  const [isMount, setIsMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { address } = useAccount()

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  const dropdownOptions = [
    {
      id: 1,
      link: `/profile/${address}`,
      label: 'Profile',
    },
    {
      id: 2,
      link: `/setting`,
      label: 'Setting',
    },
  ]

  const handleOptionClick = async (id: number) => {
    setIsOpen(false)
    if (id === 3) {
      handleDisconnect()
    }
  }

  // Event handler for toggling the dropdown open/close state
  const toggleDropdown = () => {
    setIsOpen(prev => {
      setIsProfileDropdownOpen(!prev)
      return !prev
    })
  }

  useMemo(() => {
    setIsOpen(isProfileDropdownOpen)
  }, [isProfileDropdownOpen])

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    setIsMounted(true)
    return () => {
      document.removeEventListener('click', handleClickOutside)
      setIsOpen(false)
    }
  }, [])

  const handleThemeChange = (value: boolean) => {
    if (value) {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="] flex items-center justify-center rounded-full bg-neutral-800 dark:bg-neutral-400 smd:h-12 smd:w-12"
        onClick={toggleDropdown}
      >
        <UserProfileIcon className="!h-[16px] !w-[16px] smd:!h-[24px] smd:!w-[24px]" />
      </button>
      {isOpen && (
        <div className="">
          <ul
            className={`absolute right-0 z-[100] mt-3 w-[265px] gap-y-[40px]  overflow-hidden rounded-t-[0px] bg-gradient-to-t   from-pink-400  to-pink-500 to-80% pb-2 duration-300  ease-in-out dark:bg-[#212121]  smd:rounded-t-[16px] ${
              isOpen ? '' : 'max-h-0 overflow-hidden'
            }`}
          >
            <div className="bg-white dark:bg-[#141414]">
              {dropdownOptions.map(option => (
                <li
                  className="item-center  flex cursor-pointer items-center gap-x-6 bg-white px-10 py-4 even:py-4 dark:bg-[#141414]"
                  key={option.id}
                  onClick={e => {
                    e.stopPropagation()
                    handleOptionClick(option.id)
                  }}
                >
                  {/* Conditional rendering of icons */}
                  <Link href={option.link}>
                    <Typography
                      className={`text-lg font-semibold text-light   hover:text-[#141414] dark:text-neutral-500 dark:hover:text-white`}
                    >
                      {option.label}
                    </Typography>
                  </Link>
                </li>
              ))}

              <li className=" item-center  group  flex cursor-pointer  items-center justify-between gap-x-6 bg-white px-10 py-4 even:py-4 dark:bg-[#141414] xxl:hidden">
                <Typography
                  className={`text-lg font-semibold text-light   hover:text-[#141414] dark:text-neutral-500 dark:group-hover:text-white`}
                >
                  Dark mode
                </Typography>

                {isMount && (
                  <Toggle
                    className="h-[30px] w-[80px]  dark:group-hover:stroke-pink-500"
                    defaultCheck={theme === 'dark' ? true : false}
                    onChange={handleThemeChange}
                  />
                )}
              </li>
              <li
                className=" item-center  flex cursor-pointer  items-center justify-between gap-x-6 bg-white px-10 py-4 even:py-4 dark:bg-[#141414] "
                onClick={e => {
                  e.stopPropagation()
                  handleOptionClick(3)
                }}
              >
                <Typography
                  className={`text-lg font-semibold text-light hover:text-[#141414]   dark:text-neutral-500 dark:hover:text-white`}
                >
                  Log out
                </Typography>
              </li>
            </div>
          </ul>
        </div>
      )}
    </div>
  )
}
