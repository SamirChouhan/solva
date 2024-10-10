import React from 'react'
import type { Metadata } from 'next'

import ItemDetailTemplate from '@/design-systems/Templates/ItemDetailTemplate'
import { getItemActivity, getItemDetails } from '@/api-services/ItemDetailService'

interface PageProps {
  params: {
    id: string
  }
}
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const data = await getItemDetails({ collectible_id: params.id })

    return {
      title: data.data.title,
      description: data.data.description,
      metadataBase: new URL('https://solav-frontend-develop.vercel.app'),
      openGraph: {
        title: data.data.title,
      },
    }
  } catch (error) {
    return {
      title: 'Item Not found',
    }
  }
}

export default async function Page({ params }: PageProps) {
  const [itemDetails, itemActivity] = await Promise.all([
    getItemDetails({ collectible_id: params.id }),
    getItemActivity({ collectible_id: params.id }),
  ])

  return <ItemDetailTemplate data={{ itemDetails, itemActivity: itemActivity }} />
}
