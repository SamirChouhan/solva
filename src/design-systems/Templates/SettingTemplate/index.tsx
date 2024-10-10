'use client'
import React from 'react'

import ProfileImage from '@/design-systems/Molecules/ProfileImage'
import SettingForm from '@/design-systems/Organisms/Profile/Edit/SettingForm'
import PurchaseHistoryTable from '@/design-systems/Organisms/Profile/Edit/PurchaseHistoryTable'
import { useUserContext } from '@/context/UserContext'

const SettingTemplate = () => {
  const { signatureData } = useUserContext()

  return (
    <div className="mt-20 w-full">
      <ProfileImage isActive isShowBottomText userImage={signatureData.user?.image} />
      <SettingForm />
      <PurchaseHistoryTable />
    </div>
  )
}

export default SettingTemplate
