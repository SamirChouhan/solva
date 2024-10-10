'use client'
import React, { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'

import Typography from '@/design-systems/Atoms/Typography'
import PricingCard from '@/design-systems/Organisms/Pricing/PricingCard'
import { useSubscription } from '@/hooks/ApiHooks/useSubscription'
import { AddressString } from '@/interfaces'
import ABIS from '@/app/abis'
import { useSolavTransfer } from '@/hooks/ApiHooks/useSolavTransfer'
import {
  CHAIN_ID,
  getSolavTokenContractAddress,
  getSubscriptionContractAddress,
  handleWriteContractOperation,
} from '@/utils'

const PricingTemplate: React.FC = () => {
  const { subscriptionPlanList, subscribePlanMutateAsync, isLoadingSubscribePlan, subscriptionPlanListLoading } =
    useSubscription()
  const solavTransferMutation = useSolavTransfer()
  const router = useRouter()

  const [activeBtn, setActiveBtn] = useState<string>('')
  const [isLoad, setIsLoad] = useState<boolean>(false)
  const { chainId } = useAccount()
  const solavTokenContractAddress = useMemo(() => getSolavTokenContractAddress(chainId || 0), [chainId])
  const subscriptionContractAddress = useMemo(() => getSubscriptionContractAddress(chainId || 0), [chainId])

  const handleSolavPurchase = async (
    planName: string,
    id: string,
    description: string,
    userId: string,
    price: bigint,
    type: number
  ) => {
    setActiveBtn(id)
    setIsLoad(true)

    const promise = new Promise((resolve, reject) => {
      ;(async () => {
        try {
          const paymentResponse = (await subscribePlanMutateAsync({
            planName: planName,
            planId: id,
            description: description,
            userId: userId,
            method: 'token',
          })) as PaymentResponseForToken

          await handleWriteContractOperation(
            'approve',
            [subscriptionContractAddress, price],
            solavTokenContractAddress as AddressString,
            ABIS.solavToken,
            chainId
          )

          const subscribeTrans = await handleWriteContractOperation(
            'subscribe',
            [price, type, solavTokenContractAddress],
            subscriptionContractAddress as AddressString,
            ABIS.subscribeAbi,
            chainId
          )

          solavTransferMutation.mutate(
            {
              contract_address: subscriptionContractAddress,
              network_id: chainId === CHAIN_ID.polygon ? 2 : 1,
              payment_id: paymentResponse.data.id,
              plan_id: id,
              transaction_hash: subscribeTrans,
              user_id: userId,
            },
            {
              onSuccess: () => {
                resolve(true)
                router.push('/')
              },

              onError: e => {
                reject(e)
              },
            }
          )
        } catch (error) {
          reject(error)
        }
      })()
    })

    toast.promise(promise, {
      pending: 'Purchasing Bundle...',
      success: {
        render() {
          setIsLoad(false)
          return <>Bundle Purchased Successfully</>
        },
      },
      error: {
        render({ data }: { data: Error }) {
          setIsLoad(false)
          return <>{data.message}</>
        },
      },
    })
  }

  return (
    <div className="overflow-hidden">
      <Typography className="mt-6 text-center" size="h3">
        Pricing
      </Typography>

      <Typography className="mt-4 text-center" size="paragraph">
        Explore our plans
      </Typography>

      <div className="mb-[120px] mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lmd:grid-cols-3">
        {!subscriptionPlanListLoading && subscriptionPlanList && subscriptionPlanList.length
          ? subscriptionPlanList.map((item, index) => (
              <PricingCard
                disabled={isLoadingSubscribePlan || isLoad}
                handleChoosePlan={handleSolavPurchase}
                index={index}
                isLoading={(isLoadingSubscribePlan || isLoad) && activeBtn === item.id}
                item={item}
                key={index}
              />
            ))
          : Array.from({ length: 3 }).map((_, index) => (
              <div
                className="h-full min-h-[350px] w-full animate-pulse rounded-lg bg-neutral-600 dark:bg-neutral-300"
                key={index}
              ></div>
            ))}
      </div>
    </div>
  )
}

export default PricingTemplate
