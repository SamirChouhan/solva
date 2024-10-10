import React from 'react'

import Spinner from '@/design-systems/Atoms/Spinner'

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Spinner className="h-[36px] w-[36px] animate-spin" />
    </div>
  )
}
