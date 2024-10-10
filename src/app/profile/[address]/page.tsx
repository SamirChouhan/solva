'use client'

import React, { Suspense } from 'react'

import ProfileTemplate from '@/design-systems/Templates/ProfileTemplate'
import Spinner from '@/design-systems/Atoms/Spinner'

const ProfilePage = () => {
  return (
    <Suspense
      fallback={
        <div className="my-14 flex w-full items-center justify-center">
          <Spinner className="h-[36px] w-[36px] animate-spin" />
        </div>
      }
    >
      <ProfileTemplate />
    </Suspense>
  )
}

export default ProfilePage
