import { Dispatch, SetStateAction } from 'react'

import { AnyFunction } from '@/interfaces'

export interface SwitchChianType {
  isSignedData: boolean
  signInWithEthereum: AnyFunction
  setIsChainDropdownOpen: (value: boolean) => void
  isChainDropdownOpen: boolean
}
