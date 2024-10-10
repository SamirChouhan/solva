import { AnyFunction } from '@/interfaces'

export interface UserProfileType {
  handleDisconnect: AnyFunction
  isOpen?: boolean
  setIsProfileDropdownOpen: (value: boolean) => void
  isProfileDropdownOpen: boolean
}
