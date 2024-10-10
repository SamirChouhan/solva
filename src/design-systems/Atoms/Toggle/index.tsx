import { useState } from 'react'

import Typography from '../Typography'

import { ToggleProps } from './interface'
import { toggleContaineClass, toggleClass } from './utils'

import { brandGradient } from '@/utils'

const Toggle: React.FC<ToggleProps> = ({ defaultCheck = false, onChange }) => {
  const [toggled, setToggled] = useState<boolean>(defaultCheck)

  const handleChange = () => {
    setToggled((prevState: boolean) => {
      onChange?.(!prevState)
      return !prevState
    })
  }
  return (
    <div
      className={`flex h-8 w-[59px] items-center justify-center overflow-hidden rounded-2xl border-0   
        ${toggled ? brandGradient : 'bg-[#bcbaba] dark:bg-[#595959]'} `}
    >
      <div className="relative flex items-center ">
        <div
          className="gradient-text absolute h-[39px] w-[59px] rounded-2xl"
          style={{
            transform: `translateX(${toggled ? 0 : 60}px)`,
          }}
        />

        <div
          className="relative flex  w-[52px]  select-none items-center justify-between "
          onClick={e => {
            e.stopPropagation()
            handleChange()
          }}
        >
          <div className={toggleContaineClass}>
            <Typography
              className={`${toggleClass} ${!toggled ? 'bg-white font-medium text-white' : ' text-gray font-normal'}`}
            ></Typography>
          </div>
          <div className={toggleContaineClass}>
            <Typography
              className={`${toggleClass} ${toggled ? 'bg-white font-medium text-white ' : 'text-gray font-normal '}`}
            ></Typography>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Toggle
