import { useInfiniteQuery } from '@tanstack/react-query'

import ProfileService from '@/api-services/ProfileService'

const useUserPlanHistory = (user_id: string, type: string, page_number: number, page_size: number) => {
  const profileTabQuery = useInfiniteQuery({
    queryKey: ['user-plan-history', user_id, page_number, page_size, type],
    queryFn: ({ pageParam }) => {
      return ProfileService.getUserPlanHistory({ type, page_number: pageParam, page_size })
    },

    initialPageParam: page_number,
    // enabled: !!tab && !!address,
    select: res => res.pages.map(page => page.data).flat(),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.data) {
        return undefined
      }
      if (lastPage.data.length < 3) {
        return undefined
      }
      return allPages.length + 1
    },
  })

  return profileTabQuery
}

export default useUserPlanHistory
