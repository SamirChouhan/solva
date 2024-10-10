'use client'
import React, { FC, useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { useAccount } from 'wagmi'
import { toast } from 'react-toastify'

import PromptExamples from '../../Organisms/PromptExamples'

import Typography from '@/design-systems/Atoms/Typography'
import Input from '@/design-systems/Atoms/Input'
import Button from '@/design-systems/Atoms/Button'
import { useToggle } from '@/hooks'
import { usePromptContext } from '@/context/PromptContext'
import PromptConformModal from '@/design-systems/Molecules/Modals/PromptConformModal'
import SubscriptionModal from '@/design-systems/Molecules/Modals/SubscriptionModal'
import { useSubscriptionContext } from '@/context/SubscriptionContext'
import { useSubscription } from '@/hooks/ApiHooks/useSubscription'
import { useUserContext } from '@/context/UserContext'
import { SubscribePlanResponse } from '@/api-services/interfaces/home'

const GenerateNftTemplate: FC = () => {
  const [state, _, turn, turnOn] = useToggle(false)
  const { prompt, setPrompt } = usePromptContext()
  const [subscriptionModal, setSubscriptionModal] = useState<boolean>(false)
  const { selectedPlan, setSelectedPlan } = useSubscriptionContext()
  const { isConnected } = useAccount()
  const { signatureData } = useUserContext()

  const { subscriptionPlanList, subscribePlanMutateAsync, isLoadingSubscribePlan } = useSubscription()

  const { values, handleChange, handleBlur, handleSubmit, errors } = useFormik<FormValues>({
    initialValues: {
      prompt: '',
    },
    validationSchema: Yup.object({
      prompt: Yup.string().required('Please fill prompt field.'),
    }),
    onSubmit: values => {
      if (isConnected) {
        setPrompt(values.prompt)
        turnOn()
      } else {
        toast.error('Please connect wallet')
      }
    },
  })

  const handleUpgradePlan = (type: string) => {
    return toast.info('Coming soon...')
    if (type === 'silver') {
      setSelectedPlan(subscriptionPlanList[1])
    } else if (type === 'gold') {
      setSelectedPlan(subscriptionPlanList[2])
    }
    setSubscriptionModal(true)
    turn(false)
  }

  const handleGoBack = () => {
    setSubscriptionModal(false)
    turn(true)
  }

  const handleChoosePlan = async () => {
    try {
      const response = (await subscribePlanMutateAsync({
        planName: 'standard plan',
        planId: '65e8259c7d0e80b38508de74',
        description: selectedPlan?.description,
        userId: signatureData.user.id,
        method: 'currency',
      })) as SubscribePlanResponse
      setSubscriptionModal(false)
      window.open(response.url, '_blank')
    } catch (error) {}
  }

  return (
    <main>
      <div className="my-0 pb-[64px] smd:pb-[72px] md:pb-[80px] lg:pb-[120px]">
        <div className="video-back d-flex relative items-center justify-center">
          <div className="banner_video_wrap">
            <video autoPlay className="banner_video hidden md:block" id="myVid1241eo" loop muted>
              <source src={'videos/solav-banner-video.mp4'} type="video/mp4" />
            </video>

            <div className="video_gradient from-18%  to-76%  bg-gradient-to-b  from-gray-100 via-[#f9f2ff]  to-[#f9f2ff] dark:via-neutral-100 dark:to-neutral-100"></div>
          </div>
          <div className="container relative z-[3] mx-auto pb-9 pt-[58px] smd:pb-16 lmd:pt-20">
            <div className="text-center smd:mt-8 ">
              <Typography className="mb-2 text-left smd:text-center xlg:text-left" size="h2">
                Generate your
                <span className="from-18.71% font- ml-2 rounded-6xl bg-gradient-to-t  from-pink-400   to-pink-500 to-80% px-xl   font-poppins leading-[100%] text-white">
                  NFT
                </span>
                <span className="ml-1 font-allura font-[400]">with</span>
              </Typography>
              <div className="flex-col justify-start xs:flex smd:items-center smd:justify-center xlg:block xlg:items-center xlg:justify-start">
                <Typography className="text-left smd:text-center xlg:text-left" size="h2">
                  Artificial Intelligence.
                </Typography>
                <div className="flex w-[255px] gap-5  smd:w-[279px] smd:gap-10 md:w-[450px] lg:self-center  xlg:justify-start">
                  <div className=" from-18.71% h-1 w-[67%]   rounded-6xl bg-gradient-to-t  from-pink-400   to-pink-500 to-80%"></div>
                  <div className="from-18.71% h-1 w-[25%]  rounded-6xl bg-gradient-to-t  from-pink-400   to-pink-500 to-80%"></div>
                </div>
              </div>

              <Typography
                className="mt-4 text-left text-neutral-400 smd:text-center lg:text-[20px] xlg:text-left"
                size="bold-paragraph"
              >
                Create and deploy NFT artwork in seconds
              </Typography>
            </div>
            <div className=" mt-[40px] flex flex-col items-center smd:mt-[50px]">
              <form
                className="relative mb-4 flex w-[100%] items-center justify-center gap-3 rounded-6xl border border-solid border-neutral-600  px-lg  dark:border-neutral-300 smd:mb-8 smd:w-[95%] lmd:w-[80%]   lg:w-[85%] xlg:w-[75%]"
                onSubmit={handleSubmit}
              >
                <Input
                  inWrpClassName="bg-transparent border-0 "
                  inputClassNames="xs:!p-3 smd:!p-6"
                  name="prompt"
                  placeholder="Describe what you want to generate"
                  type="text"
                  value={values.prompt}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <Button
                  className="hidden  text-center  text-white smd:w-[40%] md:block lmd:w-[40%]  lg:w-[33%]"
                  type="submit"
                >
                  Generate NFT
                </Button>
                {errors.prompt && (
                  <Typography className=" absolute bottom-[-31px] mt-2 text-left text-base text-error-800 smd:text-lg ">
                    {errors.prompt}
                  </Typography>
                )}
              </form>
              {/* <div className="mt-4  flex w-full flex-col items-center  justify-center gap-3 md:flex-row">
                <Button
                  className="w-full text-white  smd:w-[80%] md:hidden  md:w-[40%] lmd:w-[30%] "
                  type="submit"
                  onClick={() => handleSubmit()}
                >
                  Generate NFT
                </Button>
                <Button
                  className="group w-fit"
                  icon={<PenIcon className="fill-neutral-100 group-hover:!fill-neutral-800 dark:!fill-neutral-800 " />}
                  iconPosition="end"
                  variant="outlined"
                >
                  Generate by Image
                </Button>
                <Button className="w-fit" variant="outlined">
                  Advanced settings
                </Button>
              </div> */}
            </div>
          </div>
        </div>
        <PromptExamples />
      </div>
      <PromptConformModal handleUpgradePlan={handleUpgradePlan} open={state} prompt={prompt} setIsModalOpen={turn} />
      <SubscriptionModal
        description={selectedPlan?.description}
        features={selectedPlan?.planName}
        handleChoosePlan={handleChoosePlan}
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

export default GenerateNftTemplate
