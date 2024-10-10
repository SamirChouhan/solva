import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import ProfileService from '@/api-services/ProfileService'

export const useLike = () => {
  const likeMutation = useMutation({
    mutationFn: (data: LikeDataMutationType) => {
      return ProfileService.doLike(data)
    },

    onSuccess: data => {
      toast.info(data.message)
    },
  })
  return { likeMutation }
}
