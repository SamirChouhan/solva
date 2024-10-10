import { toast } from 'react-toastify'

import ImageUploadService from '@/api-services/ImageUploadService'

export const useImageUpload = () => {
  const uploadImage = async (image: File) => {
    try {
      const formData = new FormData()
      formData.append('file', image)

      const awsObj = await ImageUploadService.getUploadUrl({
        fileName: encodeURIComponent(Date.now() + '.' + image.name.split('.')[1]),
        contentType: encodeURIComponent(image.type),
        fileType: image.type.split('/')?.[1],
      })

      const finalRes = await fetch(awsObj.preSignedUrl, {
        body: image,
        method: 'PUT',
      })

      if (finalRes.ok) {
        return awsObj.regularUrl
      } else {
        return ''
      }
    } catch (error) {
      toast.error('Something went wrong.')
    }
  }

  return uploadImage
}
