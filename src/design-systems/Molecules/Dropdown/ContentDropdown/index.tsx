import React, { useEffect } from 'react'

import { ContentDropdownProps } from './interface'

import { DownArrow } from '@/design-systems/Atoms/Icons'
import Typography from '@/design-systems/Atoms/Typography'
import { useToggle } from '@/hooks'

const ContentDropdown: React.FC<ContentDropdownProps> = ({ children, label, initialState }) => {
  const [state, toggle, , turnOn, turnOff] = useToggle(initialState)

  useEffect(() => {
    if (initialState) {
      turnOn()
    } else {
      turnOff()
    }
  }, [initialState, turnOff, turnOn])

  return (
    <div
      className={`w-full transform overflow-hidden rounded-sm bg-pink-900 p-4 transition-transform duration-300 ease-in dark:bg-neutral-200 ${state ? 'h-auto !overflow-visible' : 'h-12'}`}
      onClick={toggle}
    >
      <div className="flex items-start justify-between ">
        <Typography className="mb-4" size="button">
          {label}
        </Typography>
        <DownArrow
          className={`mt-1 transform ${state ? 'rotate-180' : 'rotate-0'} transition-transform duration-300 ease-in dark:stroke-neutral-800`}
        />
      </div>
      {children}
    </div>
  )
}

export default ContentDropdown
