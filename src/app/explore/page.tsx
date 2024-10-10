import React, { Suspense } from 'react'

import Loading from '../loding'

import ExploreTemplate from '@/design-systems/Templates/ExploreTemplate'

const ExplorePage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <ExploreTemplate />
    </Suspense>
  )
}

export default ExplorePage
