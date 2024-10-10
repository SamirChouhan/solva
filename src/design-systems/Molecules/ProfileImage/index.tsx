'use client'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

import { EditIcon } from '@/design-systems/Atoms/Icons'
import Image from '@/design-systems/Atoms/Image'
import { useUser } from '@/hooks/ApiHooks/useUser'
import { useImageUpload } from '@/hooks/useImageUpload'
import dummyProfileImage from '@/assets/images/default.jpg'
import Typography from '@/design-systems/Atoms/Typography'

interface ProfileImageProps {
  isShowBottomText?: boolean
  userImage: string
  isActive: boolean
}

const ProfileImage: React.FC<ProfileImageProps> = ({ isShowBottomText = false, userImage, isActive }) => {
  const { updateUserMutation } = useUser()
  const [image, setImage] = useState<File | null>(null)
  const uploadImage = useImageUpload()

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target.files?.[0]
    if (file) {
      setImage(file)
      uploadImage(file).then(res => {
        if (res) {
          updateUserMutation.mutate(
            { attachmentUrl: res },
            {
              onSuccess: () => {
                toast.success('Image uploaded successfully')
              },
            }
          )
        }
      })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`group relative h-[124px] w-[124px] rounded-full ${!isActive ? 'pointer-events-none' : ''}`}>
        <label
          className="absolute inset-0 z-10 hidden h-full w-full cursor-pointer select-none items-center justify-center overflow-hidden rounded-full bg-neutral-600 opacity-[.9] group-hover:flex dark:bg-neutral-300"
          htmlFor="image-upload"
        >
          <input
            accept=".png, .jpg, .jpeg"
            disabled={!isActive}
            hidden
            id="image-upload"
            type="file"
            onChange={isActive ? handleUpload : undefined}
          />
          <EditIcon className="text-white" height={'40%'} width={'40%'} />
        </label>

        <Image
          alt="profile image"
          className="overflow-hidden rounded-full"
          src={image ? URL.createObjectURL(image) : userImage?.includes('http') ? userImage : dummyProfileImage}
          styles={`h-full w-full object-cover`}
        />
      </div>
      {isShowBottomText && (
        <label htmlFor="image-upload">
          <Typography className="cursor-pointer bg-[linear-gradient(180deg,_#C433FF_18.71%,_#9B00FF_80%)] bg-clip-text text-center text-paragraph font-bold text-transparent">
            Edit Picture
          </Typography>
        </label>
      )}
    </div>
  )
}

export default ProfileImage
