import { useQuery } from '@tanstack/react-query'

import { QUERIES_KEY } from '@/utils'
import ProfileService from '@/api-services/ProfileService'
import { UserType } from '@/context/UserContext/interface'
import { AddressString } from '@/interfaces'

export const useUserData = (walletAddress?: AddressString) => {
  const {
    isLoading: isLoadingUserData,
    data: userData,
    status: statusUserData,
    refetch: refetchUserData,
  } = useQuery({
    queryKey: ['profile', QUERIES_KEY.PRIVATE.GET_USER_DATA, walletAddress],
    queryFn: () =>
      ProfileService.getUserData({
        user_address: walletAddress,
      }),
    select: res => res.data,
    enabled: Boolean(walletAddress),
  })

  return {
    isLoadingUserData,
    userData: userData as UserType,
    statusUserData,
    refetchUserData,
  }
}
