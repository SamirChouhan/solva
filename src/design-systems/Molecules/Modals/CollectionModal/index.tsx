import React, { useEffect, useMemo, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAccount } from 'wagmi'
import { toast } from 'react-toastify'
import { CollectionModalProps } from './interface'
import Image from '@/design-systems/Atoms/Image'
import Typography from '@/design-systems/Atoms/Typography'
import Button from '@/design-systems/Atoms/Button'
import Modal from '@/design-systems/Atoms/Modal'
import Input from '@/design-systems/Atoms/Input'
import TextAreaInput from '@/design-systems/Atoms/TextAreaInput'
import { EditIcon } from '@/design-systems/Atoms/Icons'
import dummyProfileImage from '@/assets/images/default-image.svg'
import Spinner from '@/design-systems/Atoms/Spinner'
import {
  CONTRACT_URI,
  TOKEN_URI_PREFIX,
  getCustomCollectionContractAddress,
  getNetworkIdByChainId,
  writeContractTxResponse,
} from '@/utils'
import { useCreateCollection } from '@/hooks/ApiHooks/useCreateCollection'
import { OnCreateCollectionQuery, OnUpdateCollectionAddressQuery } from '@/api-services/interfaces/home'
import { AddressString } from '@/interfaces'
import { useUpdateCollectionAddress } from '@/hooks/ApiHooks/useUpdateCollectionAddress'
import ABIS from '@/app/abis'

const notAllowedUserCustomUrl = [
  'home',
  'home_new',
  'explore',
  'rewards',
  'solav-drops',
  'create',
  'connect-wallet',
  'claim',
  'claimsuccess',
  'profileedit',
  'profileupvote',
  'profilecommunity-upvote',
  'profileverify',
  'profileverifytwitter',
  'user-list',
  'view-sells',
  'redeem-verification',
  'redeem-list',
  'reports-list',
  'item-approval',
  'solav-drop',
  'collection-details',
  'list-nft',
  'admin',
  'presale-settings',
  'ilo',
  'stake',
  'careers',
  'about',
  'whitelist-seller',
  'support',
  'category',
  'warehouse',
  'agov-dao-lp-staking',
  'view-sells-report',
  'stats-report',
  'admin-all-item-report',
  '404',
]

interface ProfileFormValues {
  displayName: string
  symbol: string
  description: string
  customUrl: string
  bannerImage: File | null
}

const CollectionModal: React.FC<CollectionModalProps> = ({ onCollectionCreated, open, setIsModalOpen, className }) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(open)
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [bannerImage, setBannerImage] = useState<File | null>(null)
  const { createCollectionMutateAsync } = useCreateCollection()
  const { updateCollectionAddressMutateAsync } = useUpdateCollectionAddress()
  const { chainId } = useAccount()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const connectedNetworkId = useMemo(() => getNetworkIdByChainId(chainId), [chainId])
  const customCollectionContractAddress = useMemo(() => getCustomCollectionContractAddress(chainId), [chainId])
  const initialValues: ProfileFormValues = {
    displayName: '',
    symbol: '',
    description: '',
    customUrl: '',
    bannerImage: null,
  }

  const validationSchema = Yup.object({
    displayName: Yup.string().required('Display name is required'),
    symbol: Yup.string().required('Symbol is required'),
    description: Yup.string().required('Description is required'),
    customUrl: Yup.string()
      .required('Custom URL is required')
      .matches(/^[a-zA-Z0-9_-]+$/, 'Special characters not allowed in Custom URL')
      .notOneOf(notAllowedUserCustomUrl, 'Custom URL is not valid')
      .test('no-0x-prefix', 'Custom URL is not allowed as same wallet address', value => !value?.startsWith('0x')),
    bannerImage: Yup.mixed().required('Banner image is required'),
  })

  const handleCreateCollection = async () => {
    const promise = new Promise((resolve, reject) => {
      ;(async () => {
        try {
          setIsLoading(true)
          const contractAddress = customCollectionContractAddress
          const networkId = connectedNetworkId
          const collectionPayload: OnCreateCollectionQuery = {
            displayName: formik.values.displayName,
            network_id: networkId,
            description: formik.values.description,
            banner_image: bannerImage,
            image: profileImage,
            custom_url: formik.values.customUrl,
          }
          const createCollectionApiReponse = await createCollectionMutateAsync({
            ...collectionPayload,
          })
          if (createCollectionApiReponse.status) {
            const ipfsHash = createCollectionApiReponse.data.ipfsHash
            const createCollectionResponse = await writeContractTxResponse(
              'createCollection',
              [formik.values.displayName, formik.values.symbol, CONTRACT_URI, `${TOKEN_URI_PREFIX}/${ipfsHash}`],
              contractAddress as AddressString,
              ABIS.createCustomCollection,
              chainId
            )
            if (createCollectionResponse.status) {
              const collectionId = createCollectionApiReponse.data.id

              const updateCollectionPayload: OnUpdateCollectionAddressQuery = {
                _id: collectionId,
                network_id: networkId,
                transaction_hash: createCollectionResponse.transactionHash,
              }

              const updateCollection = await updateCollectionAddressMutateAsync(updateCollectionPayload)
              if (updateCollection.status) {
                setIsLoading(false)
                setIsModalOpen(false)
                onCollectionCreated()
                resolve(true)
              } else {
                throw new Error(updateCollection.message)
              }
            }
          } else {
            throw new Error(createCollectionApiReponse.message)
          }
        } catch (error) {
          setIsLoading(false)
          setIsModalOpen(false)
          reject(error)
        }
      })()
    })
    toast.promise(promise, {
      pending: 'Creating Collection...',
      success: {
        render() {
          setIsLoading(false)
          return <>Collection Created Successfully</>
        },
      },
      error: {
        render({ data }: { data: Error }) {
          setIsLoading(false)
          setIsModalOpen(false)
          return <>{data ? data.message : 'Creating Collection failed'}</>
        },
      },
    })
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleCreateCollection,
  })

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target.files?.[0]
    if (file) {
      setProfileImage(file)
    }
  }

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target.files?.[0]
    if (file) {
      setBannerImage(file)
      formik.setFieldValue('bannerImage', file)
    }
  }

  useEffect(() => {
    setModalOpen(open)
  }, [open])

  const handleClose = () => {
    setIsModalOpen(false)
  }

  return (
    <Modal
      description="Check your prompt"
      handleClose={handleClose}
      label={'Create Collection'}
      open={open}
      popUpWrapClassName=""
    >
      <form onSubmit={formik.handleSubmit}>
        <div className={`${className} w-full overflow-y-auto p-[24px]`}>
          <div>
            <Typography className="mt-3 !font-medium text-[#bdbdbd]" size="bold-paragraph">
              <div>PROFILE IMAGE*</div>
              <div>We recommend you use square format at least 300 x 300px. (jpg, png, gif, svg)</div>
            </Typography>
            <div className="mt-3">
              <div className="flex select-none flex-col items-start justify-center gap-4 ">
                <div className="group relative h-[124px] w-[124px] overflow-hidden">
                  <input
                    accept=".png, .jpg, .jpeg"
                    hidden
                    id="profileImage-upload"
                    type="file"
                    onChange={handleProfileUpload}
                  />
                  <label
                    className="absolute inset-0 z-10 hidden h-full w-full cursor-pointer select-none items-center justify-center overflow-hidden rounded-full bg-neutral-600 opacity-[.9] group-hover:flex dark:bg-neutral-300"
                    htmlFor="profileImage-upload"
                  >
                    <EditIcon className="text-white" height={'40%'} width={'40%'} />
                  </label>
                  <Image
                    alt="profile image"
                    src={profileImage ? URL.createObjectURL(profileImage) : dummyProfileImage}
                    styles={`h-full w-full object-cover`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <Typography className="mt-3 !font-medium text-[#bdbdbd]" size="bold-paragraph">
              <div>BANNER IMAGE*</div>
              <div>We recommend you use square format at least 1440 x 270px. (jpg, png, gif, svg)</div>
            </Typography>
            <div className="mb-3 mt-3">
              <div className="flex select-none flex-col items-start justify-center gap-4 ">
                <div className="group relative h-[124px] w-[124px] overflow-hidden">
                  <input
                    accept=".png, .jpg, .jpeg"
                    hidden
                    id="bannerImage-upload"
                    type="file"
                    onChange={handleBannerUpload}
                  />
                  <label
                    className="absolute inset-0 z-10 hidden h-full w-full cursor-pointer select-none items-center justify-center overflow-hidden rounded-full bg-neutral-600 opacity-[.9] group-hover:flex dark:bg-neutral-300"
                    htmlFor="bannerImage-upload"
                  >
                    <EditIcon className="text-white" height={'40%'} width={'40%'} />
                  </label>
                  <Image
                    alt="banner image"
                    src={bannerImage ? URL.createObjectURL(bannerImage) : dummyProfileImage}
                    styles={`h-full w-full object-cover`}
                  />
                </div>
              </div>
            </div>
            {formik.touched.bannerImage && formik.errors.bannerImage && (
              <Typography className="text-red-500" size="small">
                <div style={{ color: '#F35858' }}>{formik.errors.bannerImage}</div>
              </Typography>
            )}
          </div>

          <Input
            className="mt-6"
            error={formik.errors.displayName && formik.touched.displayName ? formik.errors.displayName : ''}
            errorClassName="h-5"
            label="Display Name*"
            placeholder="Enter Display name"
            rows={4}
            {...formik.getFieldProps('displayName')}
          />
          <Input
            className="mt-6"
            error={formik.errors.symbol && formik.touched.symbol ? formik.errors.symbol : ''}
            errorClassName="h-5"
            label="Symbol*"
            placeholder="Add Symbol"
            rows={4}
            {...formik.getFieldProps('symbol')}
          />

          <TextAreaInput
            className="mt-6"
            error={formik.errors.description && formik.touched.description ? formik.errors.description : ''}
            label="Description*"
            placeholder="Enter Description"
            rows={1}
            {...formik.getFieldProps('description')}
          />
          <Input
            className="mt-6"
            error={formik.errors.customUrl && formik.touched.customUrl ? formik.errors.customUrl : ''}
            errorClassName="h-5"
            label="Custom Url*"
            placeholder="Add Custom Url"
            rows={4}
            {...formik.getFieldProps('customUrl')}
          />
          <div className="mt-4 flex items-center justify-center">
            <Button className="mb-[10px] mt-4" type="submit" variant="solid" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="animate-spin" />
                  &nbsp; Creating...
                </>
              ) : (
                'Create'
              )}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default CollectionModal
