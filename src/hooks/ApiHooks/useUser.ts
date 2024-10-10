import { useMutation } from '@tanstack/react-query'

import ProfileService from '@/api-services/ProfileService'

export const useUser = () => {
  const updateUserMutation = useMutation({
    mutationFn: (data: UserData) => {
      return ProfileService.updateUserProfile(data)
    },
  })

  return {
    updateUserMutation,
  }
}
