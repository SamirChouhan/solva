import { useCallback, useEffect, useRef, useState } from 'react'

import Typography from '../Typography'
import { DownArrow } from '../Icons'

import { DropDownProps, Option } from './interface'

const DropDown: React.FC<DropDownProps> = ({ className, data = [], defaultValue, onChange }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [value, setValue] = useState<Option>(defaultValue)

  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, []) // Empty dependency array to run only once

  const handleClick = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const handleChange = (selectedValue: Option) => {
    setValue(selectedValue)
    onChange?.(selectedValue)
    setIsOpen(false)
  }
  // Update selected value when defaultValue changes
  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return (
    <div className="relative h-[64px] w-full">
      <div
        className={`border-lightGray bg-[rgba(255, 255, 255, 0.24)] group relative block h-fit w-full cursor-pointer items-start rounded-sm  border  border-solid border-neutral-600 bg-neutral-900 px-4 py-4 dark:border-neutral-400   dark:bg-neutral-100 ${className} ${isOpen && 'bg-white opacity-100'}`}
        ref={dropdownRef}
        onClick={handleClick}
      >
        <div className="flex items-center justify-between gap-2">
          <Typography className="text-left font-Urbanist text-lg font-bold leading-[145%] ">{value?.name}</Typography>
          <div className="flex h-4 w-4 items-center">
            <DownArrow
              className={`transform ${isOpen ? 'rotate-180' : 'rotate-0'} transition-transform duration-300 ease-in`}
              height={8}
              width={12}
            />
          </div>
        </div>
        <div
          className={`w-full ${isOpen ? 'h-fit opacity-100' : 'h-0 w-full opacity-0'} absolute left-0 top-full z-50 mt-2 bg-white p-2 dark:bg-neutral-100`}
        >
          <div className="h-full w-full overflow-hidden ">
            <ul className="m-0 h-full w-full list-none space-y-3 p-0">
              {data.map((drop, i) => (
                <li
                  className="w-full cursor-pointer px-0 text-start transition-all duration-200 ease-in group-hover:ease-out"
                  key={i}
                  onClick={e => {
                    handleChange(drop)
                    e.stopPropagation()
                  }}
                  onFocus={e => e.stopPropagation()}
                >
                  <Typography
                    className={`hoverAnimation cursor-pointer text-start text-base font-semibold hover:text-neutral-100 dark:text-neutral-500  ${
                      drop?.name !== value?.name && 'text-lightGray'
                    }`}
                    size="paragraph"
                  >
                    {drop?.name}
                  </Typography>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DropDown
