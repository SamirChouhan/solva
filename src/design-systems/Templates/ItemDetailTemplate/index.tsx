import React from 'react'
import { notFound } from 'next/navigation'

import ItemMainDetailSection from '@/design-systems/Organisms/ItemDetails/ItemMainDetailSection'
import ItemTabSection from '@/design-systems/Organisms/ItemDetails/ItemTabSection'
import { ItemActivityResponse, ItemDetailsResponse } from '@/api-services/interfaces/item-details'

interface ItemDetailTemplateProps {
  data: {
    itemDetails: ItemDetailsResponse
    itemActivity: ItemActivityResponse
  }
}

const ItemDetailTemplate: React.FC<ItemDetailTemplateProps> = ({ data }) => {
  if (data.itemDetails.code === 400) return notFound()
  return (
    <div className="container mb-[120px] mt-[50px] flex flex-col items-center justify-center gap-12">
      <ItemMainDetailSection data={data.itemDetails.data} />
      <ItemTabSection data={data.itemDetails.data} itemActivity={data.itemActivity} />
    </div>
  )
}

export default ItemDetailTemplate
