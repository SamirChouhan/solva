'use client'

import React, { ReactNode, useEffect, useRef, useState } from 'react'

import Typography from '../../Typography'
import { DownArrow } from '../../Icons'

interface FilterDropDownProps {
  label: React.ReactNode
  child: { label: string; key: string }[]
  isBorder?: boolean
  position?: 'left' | 'right'
  setSortType?: (value: string) => void
  setNetworkType?: (value: string) => void
  dropdownType?: string
}
const FilterDropDown: React.FC<FilterDropDownProps> = ({
  label,
  child,
  isBorder = true,
  position = 'left',
  setSortType,
  setNetworkType,
  dropdownType,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [labelValue, setLabelValue] = useState<ReactNode>(label)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div
      className={`${position === 'right' ? '[&:last-child>.relative>ul]:!left-auto [&:last-child>.relative>ul]:!right-0' : ''} cursor-pointer `}
    >
      <div
        className={`flex items-center gap-1 rounded-full border-[2px] border-solid px-5 py-1 ${isBorder ? 'border-neutral-500' : 'border-transparent'}`}
        ref={dropdownRef}
        onClick={() => setIsOpen(prev => !prev)}
      >
        <Typography size="lg"> {labelValue}</Typography>
        <div className="flex h-4 w-4 items-center">
          <DownArrow
            className={`transform ${isOpen ? 'rotate-180' : 'rotate-0'} transition-transform duration-300 ease-in`}
            height={8}
            width={12}
          />
        </div>
      </div>
      <div className="relative">
        <ul
          className={`absolute left-0 z-20 mt-3 min-w-[240px] gap-y-[40px] rounded-t-sm bg-gradient-to-t from-pink-400 to-pink-500 to-80% pb-2 duration-300 ease-in-out lmd:-left-full ${isOpen ? 'block' : 'hidden'}`}
        >
          {child.map(option => (
            <li
              className="item-center group flex cursor-pointer items-center gap-x-6 bg-white px-8 pb-2 first:rounded-t-sm first:pt-10 last:pb-10 group-hover:text-white dark:bg-[#212121] dark:text-neutral-400 "
              key={option.key}
              onClick={() => {
                setLabelValue(option.label)
                if (dropdownType === 'sort') {
                  setSortType && setSortType(option.key)
                } else if (dropdownType === 'network') {
                  setNetworkType && setNetworkType(option.key)
                }
              }}
            >
              <Typography
                className={`text-lg font-semibold text-light group-hover:text-neutral-100 dark:text-neutral-500 dark:group-hover:text-white`}
              >
                {option.label}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default FilterDropDown
