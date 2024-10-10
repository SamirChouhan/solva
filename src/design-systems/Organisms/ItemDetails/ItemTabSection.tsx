'use client'
import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'

import ItemActivityTable from './ItemActivityTable'
import ItemDetailsCard from './ItemDetailsCard'

import Tab from '@/design-systems/Atoms/Tabs'
import { itemDetailsTab } from '@/utils'
import { ItemActivityResponse, ItemDetails } from '@/api-services/interfaces/item-details'

interface ItemTabSectionProps {
  data: ItemDetails
  itemActivity: ItemActivityResponse
}

const ItemTabSection: React.FC<ItemTabSectionProps> = ({ data, itemActivity }) => {
  const { get } = useSearchParams()
  const [active, setActive] = useState(() => get('tab') || itemDetailsTab[0].value)
  return (
    <div className="w-full">
      <div className="relative overflow-x-auto rounded-md border-[3px] border-white pb-[32px] pt-[40px] dark:border-neutral-200">
        <div className="absolute inset-0 backdrop-blur-[42px]"></div>
        <div className="relative z-[2] w-[600px] smd:w-auto">
          <div className="px-6">
            <Tab
              active={active}
              baseRoute=""
              className="mb-4"
              defaultTab={active}
              setActive={setActive}
              tabs={itemDetailsTab}
            />
          </div>
          <div className="mt-8">
            {active === 'details' && <ItemDetailsCard data={data} />}
            {active === 'item-activity' && <ItemActivityTable data={itemActivity} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemTabSection
