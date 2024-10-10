import React, { Suspense } from 'react'

import Loading from '../loding'

import MintNftTemplate from '@/design-systems/Templates/MintNftTemplate'

const MintNftPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <MintNftTemplate />
    </Suspense>
  )
}

export default MintNftPage
