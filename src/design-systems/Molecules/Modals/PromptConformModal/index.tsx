import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useAccount } from 'wagmi'

import { PromptConformModalProps } from './interface'

import Typography from '@/design-systems/Atoms/Typography'
import Button from '@/design-systems/Atoms/Button'
import Modal from '@/design-systems/Atoms/Modal'
import { useUserContext } from '@/context/UserContext'
import { useUserData } from '@/hooks/ApiHooks/useUserData'

const PromptConformModal: React.FC<PromptConformModalProps> = ({
  open,
  setIsModalOpen,
  className,
  prompt,
  handleUpgradePlan,
}) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(open)
  const router = useRouter()
  const { signatureData } = useUserContext()
  const { address } = useAccount()
  const { userData } = useUserData(address)

  const [redirectionLoading, setRedirectionLoading] = useState(false)
  useEffect(() => {
    setModalOpen(open)

    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      setRedirectionLoading(false)
    }
  }, [open])

  const handleClose = () => {
    setIsModalOpen(false)
  }

  const handleConfirm = () => {
    setRedirectionLoading(true)
    // if (!signatureData.user.isPrivate) {
    //   toast.error('Only white listed user are allowed.')
    //   return
    // }
    router.push('/select-nft')
  }

  return (
    <>
      <Modal
        description="Check your prompt"
        handleClose={handleClose}
        label={' Generate NFT Images'}
        open={isModalOpen}
        popUpWrapClassName="md:!h-fit"
      >
        <div className={`${className} flex  w-full flex-col items-center justify-center`}>
          <div className="flex w-full items-center justify-center">
            <div className="  flex h-[72px] w-[30%] items-center justify-center rounded-bl-[20px] rounded-tl-[20px] bg-pink-500 text-center  dark:h-[85px] dark:rounded-bl-[0px]  dark:rounded-tl-[0px] dark:bg-neutral-300">
              <Typography className="text-white" size="paragraph">
                Prompt
              </Typography>
            </div>
            <div
              className="dark:rounded-br-0 dark:rounded-tr-0 flex h-[85px] w-[80%]  items-center justify-start rounded-br-[20px] rounded-tr-[20px] bg-pink-900 px-[24px]  py-[15px] text-center
              dark:rounded-tr-[20px] dark:bg-neutral-200 "
            >
              <Typography className="truncate !text-neutral-100 dark:!text-neutral-500" size="paragraph">
                {prompt}
              </Typography>
            </div>
          </div>
          <div className="mb-8 mt-6 flex flex-col  items-center justify-center rounded-sm border-[1px] border-[#CDD6D7]  p-4 dark:border-neutral-300">
            {!signatureData?.user?.isPlanPurchase && (
              <Typography className="mb-2 text-center !text-heading" size="heading">
                {` ${signatureData?.user?.isPlanPurchase && !signatureData?.user?.userImagePlan?.isActive ? 'Plan exceeded' : signatureData?.user?.isFreeTierOver ? 'Free plan exceeded' : 'Free plan'}`}
              </Typography>
            )}
            <Typography className=" text-center text-neutral-500 " size="bold-paragraph">
              {signatureData?.user?.isPlanPurchase
                ? `You have ${
                    userData?.userImagePlan &&
                    Number(5 - userData?.freeImagesCount) +
                      Number(userData?.userImagePlan?.bundleImageSize - userData?.userImagePlan.totalGenerated)
                    // : Number(5 - userData?.freeImagesCount)
                  } counts left for generating images.`
                : 'You can download 5 images in the free plan. Upgrade for more images'}
            </Typography>
            {!signatureData?.user?.isPlanPurchase && (
              <div className="mt-5 flex gap-3">
                {/* <Button variant="outlined" onClick={() => handleUpgradePlan('silver')}>
                  Monthly Pay Silver
                </Button> */}
                {/* <Button variant="outlined" onClick={() => handleUpgradePlan('gold')}>
                  Buy plan
                </Button> */}

                <Link href={'/pricing'}>
                  <Button variant="outlined">Buy plan</Button>
                </Link>
              </div>
            )}
          </div>

          <Button
            className=" px-6 text-white"
            disabled={signatureData?.user?.isFreeTierOver && !signatureData?.user?.isPlanPurchase}
            loading={redirectionLoading}
            variant="solid"
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default PromptConformModal
