import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

import Typography from '../Typography'

import { DefaultTabProps } from './interface'

const Tab: React.FC<DefaultTabProps> = ({
  tabs,
  defaultTab,
  active,
  setActive,
  tabItemClass,
  baseRoute,
  isBgTabs = false,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [indicatorWidth, setIndicatorWidth] = useState<number>(0)
  const router = useRouter()
  const indicatorRef = useRef<HTMLDivElement | null>(null) // Specify the type of indicatorRef

  useEffect(() => {
    // Calculate the width of the active tab's text content
    const activeTabElement = document.querySelector(`.${tabItemClass}.active-tab`) as HTMLElement // Type assertion
    if (activeTabElement) {
      const activeTabTextWidth = activeTabElement.offsetWidth
      setIndicatorWidth(activeTabTextWidth)
    }
  }, [activeTab, tabs, indicatorWidth, tabItemClass])

  useEffect(() => {
    setActiveTab(defaultTab)
  }, [defaultTab])

  const handleTabClick = (tabValue: string) => {
    setActiveTab(tabValue)
    router.push(`${baseRoute}?tab=${tabValue}`, { scroll: false })
    if (setActive) {
      if (tabValue) {
        setActive(tabValue)
      } else if (active) {
        setActive(active)
      }
    }
  }

  if (isBgTabs) {
    return (
      <div className="flex">
        <div className={`tabs bg-xlightGray relative flex gap-6 rounded-sm smd:gap-6`}>
          {tabs.map(({ value, label }) => (
            <div
              className={`font-Poppins relative z-10 cursor-pointer rounded-lg px-4 py-1 text-base font-semibold leading-[145%] text-neutral-200 transition-all duration-300 ${tabItemClass} ${
                value === activeTab ? 'active-tab bg-pink-900' : ''
              }`}
              key={value}
              onClick={() => {
                handleTabClick(value)
              }}
            >
              {typeof label === 'string' ? (
                <Typography className={`${'font-Urbanist font-semibold tracking-paragraph text-[#595959]'} `} size="lg">
                  {label}
                </Typography>
              ) : (
                <></>
              )}
            </div>
          ))}
          <div
            className="tab-item-animate absolute bottom-0 h-full rounded-sm bg-white transition-transform duration-300"
            ref={indicatorRef}
          ></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <div className={`tabs bg-xlightGray relative flex gap-6 rounded-sm smd:gap-12`}>
        {tabs.map(({ value, label }) => (
          <div
            className={`font-Poppins relative z-10 cursor-pointer text-base font-semibold leading-[145%] text-neutral-400 transition-all duration-300 ${tabItemClass} ${
              value === activeTab
                ? 'active-tab bg-[linear-gradient(180deg,_#C433FF_18.71%,_#9B00FF_80%)] bg-clip-text text-transparent'
                : ''
            }`}
            key={value}
            onClick={() => {
              handleTabClick(value)
            }}
          >
            {typeof label === 'string' ? (
              <Typography
                className={`${activeTab === value ? 'bg-gradient-to-t from-pink-400 to-pink-500 to-80% bg-clip-text !font-bold text-transparent' : 'font-Urbanist font-semibold tracking-paragraph text-[#595959]'} `}
                size="lg"
              >
                {label}
              </Typography>
            ) : (
              <></>
            )}
          </div>
        ))}
        <div
          className="tab-item-animate absolute bottom-0 h-full rounded-sm bg-white transition-transform duration-300"
          ref={indicatorRef}
        ></div>
      </div>
    </div>
  )
}
export default Tab
