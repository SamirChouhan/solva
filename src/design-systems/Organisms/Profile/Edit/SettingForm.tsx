'use client'
import { useFormik } from 'formik'
import React, { useMemo } from 'react'
import Link from 'next/link'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { useAccount, useBalance, useReadContract, useReadContracts } from 'wagmi'
import { formatEther } from 'ethers'

import Input from '@/design-systems/Atoms/Input'
import TextAreaInput from '@/design-systems/Atoms/TextAreaInput'
import Typography from '@/design-systems/Atoms/Typography'
import Button from '@/design-systems/Atoms/Button'
import { useUserContext } from '@/context/UserContext'
import { useUser } from '@/hooks/ApiHooks/useUser'
import { AddressString } from '@/interfaces'
import erc20Abi from '@/app/abis/solavToken.json'
import { CHAIN_ID, getSolavTokenContractAddress } from '@/utils'
import { useSolavExchange } from '@/hooks/ApiHooks/useSolavExchange'

interface SettingFormProps {}

const SettingForm: React.FC<SettingFormProps> = () => {
  const { signatureData, remainingCredit } = useUserContext()
  const { updateUserMutation } = useUser()

  const { address, chainId } = useAccount()

  const result = useReadContract({
    address: getSolavTokenContractAddress(chainId || 0) as AddressString,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address],
  })

  const { data } = useSolavExchange()

  const formik = useFormik<UserData>({
    initialValues: {
      name: signatureData.user?.name || '',
      email: signatureData.user?.email || '',
      bio: signatureData.user?.bio || '',
      portfolio: signatureData.user?.portfolio || '',
      twitter_url: signatureData.user?.twitterUrl || '',
      discord_url: signatureData.user?.discordUrl || '',
      instagram_url: signatureData.user?.instagramUrl || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required').min(3, 'Must be 3 characters or more'),
      email: Yup.string().required('Required').email('Invalid email'),
      bio: Yup.string().min(25, 'Must be 25 characters or more'),
      portfolio: Yup.string().url('Invalid URL'),
      twitter_url: Yup.string().url('Invalid URL'),
      discord_url: Yup.string().url('Invalid URL'),
      instagram_url: Yup.string().url('Invalid URL'),
    }),
    enableReinitialize: true,
    onSubmit: data => {
      for (const i in data) {
        if (!data[i]) {
          delete data[i]
        }
      }
      updateUserMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Profile updated successfully')
        },
        onError: () => {
          toast.error('Something went wrong')
        },
      })
    },
  })

  const totalSolavInDollar = useMemo(() => {
    const valSolav = chainId === CHAIN_ID.etherum ? data?.data.solavEthRate : data?.data.solavMaticRate
    return address && data?.data && !result.isLoading && chainId && valSolav
      ? (parseFloat(formatEther(String(result?.data))) * valSolav).toFixed(2)
      : '0.00'
  }, [result, data, chainId, address])

  return (
    <div className="mt-16 w-full">
      <div className="flex flex-col gap-7 md:flex-row">
        <Input
          error={formik.errors.name && formik.touched.name ? formik.errors.name : ''}
          label="Display Name"
          placeholder="Enter name"
          type="text"
          {...formik.getFieldProps('name')}
        />
        <Input
          error={formik.errors.email && formik.touched.email ? formik.errors.email : ''}
          label="Email"
          placeholder="Enter email"
          type="email"
          {...formik.getFieldProps('email')}
        />
      </div>

      <div className="mt-6">
        <TextAreaInput
          error={formik.errors.bio && formik.touched.bio ? formik.errors.bio : ''}
          label="Bio"
          placeholder="Enter your bio"
          {...formik.getFieldProps('bio')}
          rows={4}
        />
      </div>

      <Typography className="mb-6 mt-10" size="title">
        Social Links
      </Typography>

      <div className="flex flex-col gap-7 md:flex-row">
        <Input
          error={formik.errors.portfolio && formik.touched.portfolio ? formik.errors.portfolio : ''}
          label="Website Url"
          placeholder="Enter link"
          type="text"
          {...formik.getFieldProps('portfolio')}
        />
        <Input
          error={formik.errors.twitter_url && formik.touched.twitter_url ? formik.errors.twitter_url : ''}
          label="X(Twitter)"
          placeholder="Enter link"
          type="text"
          {...formik.getFieldProps('twitter_url')}
        />
      </div>

      <div className="mt-6 flex flex-col gap-7 md:flex-row">
        <Input
          error={formik.errors.discord_url && formik.touched.discord_url ? formik.errors.discord_url : ''}
          label="Discord"
          placeholder="Enter link"
          type="text"
          {...formik.getFieldProps('discord_url')}
        />
        <Input
          error={formik.errors.instagram_url && formik.touched.instagram_url ? formik.errors.instagram_url : ''}
          label="Instagram"
          placeholder="Enter link"
          type="text"
          {...formik.getFieldProps('instagram_url')}
        />
      </div>

      <Button
        className="mx-auto my-6 rounded-lg px-8"
        loading={updateUserMutation.isPending}
        onClick={() => formik.handleSubmit()}
      >
        Save Settings
      </Button>

      <Typography className="mb-6 mt-10" size="title">
        Credit History
      </Typography>

      <div className="flex flex-col justify-between gap-4 lmd:flex-row lmd:gap-0">
        <div className="flex flex-col items-start justify-between gap-10 lmd:justify-normal lg:flex-row lg:items-center">
          <div className="flex flex-col items-start">
            <Typography className="text-[#989898]" size="bold-paragraph">
              Credit Balance / Plan
            </Typography>
            {signatureData.user?.planDetails?.planName ? (
              <Typography className="font-extrabold" size="title">
                {remainingCredit} Credits{' '}
                <span className="capitalize">({signatureData.user?.planDetails?.planName})</span>
              </Typography>
            ) : (
              <Typography className="font-extrabold" size="title">
                No Plan
              </Typography>
            )}
          </div>

          <Link href={'/pricing'}>
            <Button className="rounded-xl smd:!px-8">
              {signatureData.user?.planDetails?.planName ? 'Upgrade' : 'Buy'} Plan
            </Button>
          </Link>
        </div>

        <div className="flex flex-col items-start lmd:items-center">
          <Typography className="text-[#989898]" size="bold-paragraph">
            $solav token Balance
          </Typography>
          <Typography className="font-extrabold" size="title">
            {!result.isLoading && address ? parseFloat(formatEther(String(result?.data))).toFixed(3) : '0'} SOLAV/$
            {totalSolavInDollar}
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default SettingForm
