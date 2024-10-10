'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAccount } from 'wagmi'
import { toast } from 'react-toastify'
import Link from 'next/link'

import Button from '@/design-systems/Atoms/Button'
import Typography from '@/design-systems/Atoms/Typography'
import { SelectNftList } from '@/design-systems/Organisms/SelectNftList'
import Input from '@/design-systems/Atoms/Input'
import { usePromptContext } from '@/context/PromptContext'
import ContentDropdown from '@/design-systems/Molecules/Dropdown/ContentDropdown'
import { useGenerateNft } from '@/hooks/ApiHooks/useGenerateNFT'
import { BackArrow } from '@/design-systems/Atoms/Icons'
import { useToggle } from '@/hooks'
import useWindowDimensions from '@/hooks/useWindowDimensions'
import { useUserContext } from '@/context/UserContext'
import SubscriptionModal from '@/design-systems/Molecules/Modals/SubscriptionModal'
import { useSubscription } from '@/hooks/ApiHooks/useSubscription'
import { useSubscriptionContext } from '@/context/SubscriptionContext'
import { GeneratedNFT, SubscribePlanResponse } from '@/api-services/interfaces/home'
import { useUserData } from '@/hooks/ApiHooks/useUserData'

const SelectNftTemplate = () => {
  const { prompt, setPrompt, selectedNft } = usePromptContext()
  const [emptyMintError, setemptyMintError] = useState<boolean>(false)
  const { signatureData } = useUserContext()
  const [subscriptionModal, setSubscriptionModal] = useState<boolean>(false)
  const router = useRouter()
  const { address } = useAccount()

  const { generatedNftData, refetchGeneratedNft, isLoadingGeneratedNft, isRefatchingGeneratedNft, message, code } =
    useGenerateNft({
      prompt: prompt,
      user_id: signatureData?.user?.id,
    })

  const { refetchUserData, userData } = useUserData(address)

  useEffect(() => {
    if (!isRefatchingGeneratedNft && message && code === 400) {
      toast.info(message)
    }
  }, [message, code, isRefatchingGeneratedNft])

  useEffect(() => {
    if (userData && !userData.userImagePlan && userData.freeImagesCount === 5 && generatedNftData.length === 0) {
      toast.info('Plan exceeded.')
      router.push('/pricing')
    }
  }, [generatedNftData.length, router, userData])

  useEffect(() => {
    refetchUserData()
  }, [generatedNftData])

  const { selectedPlan, setSelectedPlan } = useSubscriptionContext()

  const { isLoadingSubscribePlan } = useSubscription()
  const { width } = useWindowDimensions()
  const [isFilterOpen, filteToggle, , turnOn, turnOff] = useToggle()
  const isMobile = useMemo(() => (width ? width < 480 : true), [width])

  useEffect(() => {
    if (isMobile) {
      turnOff()
    } else {
      turnOn()
    }
  }, [isMobile, turnOff, turnOn])

  const handleBack = () => router.back()
  const { values, handleChange, handleBlur, handleSubmit, errors } = useFormik<FormValues>({
    initialValues: {
      prompt: prompt,
    },
    validationSchema: Yup.object({
      prompt: Yup.string().required('Please fill prompt field.'),
    }),
    onSubmit: values => {
      setPrompt(values.prompt)
      refetchGeneratedNft()
      if (isMobile) turnOff()
    },
  })

  const handleMintNft = () => {
    if (!selectedNft) {
      setemptyMintError(true)
      return
    } else {
      router.push('mint-nft')
    }
  }

  const handleGoBack = () => {
    setSubscriptionModal(false)
  }

  useEffect(() => {
    if (selectedNft) setemptyMintError(false)
  }, [selectedNft])

  return (
    <main className=" relative  mt-8  smd:mt-12  md:mt-16">
      <div className="container mb-[40px]   smd:mb-[40px] lmd:mb-[60px]  xlg:mb-[90px]">
        <div className="flex items-center justify-between">
          <Button
            className="group p-[12px] smd:p-[18px]"
            icon={<BackArrow className="h-[18px] group-hover:stroke-white dark:stroke-white smd:h-auto" />}
            iconPosition="start"
            variant="outlined"
            onClick={handleBack}
          >
            Go Back
          </Button>
          <div className="flex items-center gap-2  ">
            <Typography
              className={`text-slate-300 hidden smd:block ${emptyMintError && '!text-error-800'}`}
              size="paragraph"
            >
              Select an image to mint
            </Typography>
            <Button className="hidden p-[12px] smd:block smd:p-[18px]" onClick={handleMintNft}>
              Mint NFT
            </Button>
            <Button className="group smd:hidden" variant="outlined" onClick={filteToggle}>
              Edit Prompt
            </Button>
          </div>
        </div>
        <div className="relative mt-8 flex gap-8 ">
          <form
            className={` ${isFilterOpen ? 'block' : 'hidden'} absolute  left-[50%] top-[-18px] z-50 flex h-[98%]  w-[100%]  translate-x-[-50%] flex-col gap-5   rounded-sm border-2  border-neutral-800 bg-gray-200/80 p-4 backdrop-blur-[42px] dark:border-neutral-200 dark:bg-neutral-100 smd:static smd:w-[45%] smd:translate-x-0 lmd:w-[30%] lg:w-[23%]`}
            method="post"
            name="generate-nft"
            onSubmit={handleSubmit}
          >
            <ContentDropdown initialState={true} label="Edit Prompt">
              <Input
                className="!w-[100%] overflow-hidden border-0"
                error={errors.prompt}
                inWrpClassName="!bg-neutral-800 rounded-[12px] border-0 dark:!bg-neutral-300"
                inputClassNames="!p-3 !dark:text-neutral-500"
                name="prompt"
                placeholder="Describe what you want to generate"
                type="text"
                value={values.prompt}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </ContentDropdown>

            {signatureData?.user?.isFreeTierOver && !signatureData?.user?.isPlanPurchase ? (
              <Link className="w-full" href="/pricing">
                <Button className="w-full" variant="outlined">
                  Subscribe
                </Button>
              </Link>
            ) : (
              <Button loading={isLoadingGeneratedNft || isRefatchingGeneratedNft} type="submit" variant="outlined">
                Re-Generate
              </Button>
            )}
          </form>

          <div className="w-full smd:w-[52%] lmd:w-[70%] lg:w-[80%]">
            <SelectNftList
              generatedNftList={generatedNftData as GeneratedNFT[]}
              isLoading={isLoadingGeneratedNft || isRefatchingGeneratedNft}
            />
          </div>
        </div>
      </div>
      <div className=" "></div>
      <div className="fixed bottom-0 left-0  z-50 w-full bg-pink-900 p-4 px-4 py-6 dark:bg-neutral-200 smd:hidden">
        <Typography
          className={`text-slate-300 mb-3 text-center  smd:block ${emptyMintError && '!text-error-800'}`}
          size="paragraph"
        >
          Select an image to mint
        </Typography>
        <Button className=" w-full " onClick={handleMintNft}>
          Mint NFT
        </Button>
      </div>
      <SubscriptionModal
        description={selectedPlan?.description}
        features={selectedPlan?.planName}
        handleChoosePlan={() => {}}
        handleGoBack={handleGoBack}
        isLoading={isLoadingSubscribePlan}
        open={subscriptionModal}
        price={selectedPlan?.priceMonthly}
        setIsModalOpen={() => setSubscriptionModal(false)}
        subsType={selectedPlan?.planType}
      />
    </main>
  )
}

export default SelectNftTemplate
