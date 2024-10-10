'use client'

import React, { useContext, useEffect, useState } from 'react'
import { useAccount, useConnect } from 'wagmi'
import { getCookie } from 'cookies-next'

import { SignatureData, SignatureResponse } from './interface'

import { useUserData } from '@/hooks/ApiHooks/useUserData'
import { getTotalCredit } from '@/utils'

export const SignatureContext = React.createContext<SignatureResponse>({
  signatureData: {} as SignatureData,
  setSignatureData: () => false,
  remainingCredit: 0,
  setIsLoadUser: () => false,
  isLoadUser: false,
  setRemainingCredit: () => false,
})

export const SignatureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [signatureData, setSignatureData] = React.useState<SignatureData>({} as SignatureData)
  const [remainingCredit, setRemainingCredit] = useState<number>(0)
  const [isLoadUser, setIsLoadUser] = useState<boolean>(false)

  const { address } = useAccount()
  const { userData } = useUserData(address)

  useEffect(() => {
    setIsLoadUser(true)
    if (userData) {
      setRemainingCredit(getTotalCredit(userData))
      setSignatureData({ token: getCookie('token') || '', user: userData })
      setIsLoadUser(false)
    }
  }, [userData, setSignatureData, setIsLoadUser])

  return (
    <SignatureContext.Provider
      value={{ signatureData, setSignatureData, remainingCredit, isLoadUser, setRemainingCredit, setIsLoadUser }}
    >
      {children}
    </SignatureContext.Provider>
  )
}

export const useUserContext = () => {
  const { signatureData, setSignatureData, remainingCredit, setRemainingCredit, isLoadUser } =
    useContext(SignatureContext)

  return { signatureData, setSignatureData, remainingCredit, setRemainingCredit, isLoadUser }
}
