// Import the copyToClipboard function (assuming it's in a separate file)

import { copyToClipboard } from '@/utils'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

interface CopyTextMutationOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const useCopyTextMutation = () => {
  return useMutation({
    mutationFn: (text: string) => copyToClipboard(text),

    onSuccess: () => {
      toast.success('Copy successful')
    },
  })
}
