'use client'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormikErrors, useFormik } from 'formik'
import * as Yup from 'yup'
import { useAccount } from 'wagmi'
import { readContracts, writeContract, signTypedData, waitForTransactionReceipt } from '@wagmi/core'
import { Interface, parseUnits } from 'ethers'
import { toast } from 'react-toastify'
import { FormikInitialValues, ListingSignPayload } from './interface'
import ABIS from '@/app/abis'
import { usePromptContext } from '@/context/PromptContext'
import Button from '@/design-systems/Atoms/Button'
import { Checkbox } from '@/design-systems/Atoms/Checkbox'
import DropDown from '@/design-systems/Atoms/DropDown'
import Input from '@/design-systems/Atoms/Input'
import TextAreaInput from '@/design-systems/Atoms/TextAreaInput'
import Toggle from '@/design-systems/Atoms/Toggle'
import Typography from '@/design-systems/Atoms/Typography'
import {
  AUCTION_TYPES,
  CHAIN_ID,
  getDefaultContractAddress,
  DROPDOWN_OPTIONS_ETH,
  DROPDOWN_OPTIONS_POLY,
  getMarketplaceContractAddress,
  marketplaceValidatorContractAddress,
  NULL_TOKEN_ADDRESS,
  SETTINGS,
  convertDate2UTCTimeStamp,
  formatDateTime,
  getNetworkIdByChainId,
} from '@/utils'
import MintingLoadingModal from '@/design-systems/Molecules/Modals/MintingLoadingModal'
import CollectionModal from '@/design-systems/Molecules/Modals/CollectionModal'
import { IconPlus, OptionIcon } from '@/design-systems/Atoms/Icons'
import NftCard from '@/design-systems/Molecules/Cards/NftCard'
import { useCreateNft } from '@/hooks/ApiHooks/useCreateNft'
import { Option } from '@/design-systems/Atoms/DropDown/interface'
import { usePutOnSale } from '@/hooks/ApiHooks/usePutOnSale'
import { OnSaleQuery } from '@/api-services/interfaces/home'
import { config } from '@/context/wagmiContext/config'
import { AddressString } from '@/interfaces'
import { selectedTokenProps } from '@/design-systems/Organisms/ItemDetails/ItemMainDetailSection'
import { useGetPlatformFee } from '@/hooks/ApiHooks/useGetPlatformFee'
import { useUserData } from '@/hooks/ApiHooks/useUserData'
import Link from 'next/link'
import { useGetCustomCollectionList } from '@/hooks/ApiHooks/useGetCustomCollection'
import Spinner from '@/design-systems/Atoms/Spinner'

const MintNftTemplate: FC = () => {
  const router = useRouter()
  const { chainId } = useAccount()
  const { address } = useAccount()
  const [isListing, setisListing] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [collectionModal, setCollectionModal] = useState<boolean>(false)
  const [platformFee, setPlatformFee] = useState<any>(0)
  const [statusMessageStep, setStatusMessageStep] = useState<string>('Step 1')
  const [statusMessageHead, setStatusMessageHead] = useState<string>('Uploading image...')
  const [selectedToken, setSelectedToken] = useState<selectedTokenProps>({ address: NULL_TOKEN_ADDRESS, title: 'ETH' })
  const { getCustomCollectionListMutateAsync } = useGetCustomCollectionList()
  const { getPlatformFeeMutateAsync } = useGetPlatformFee()
  const { userData } = useUserData(address)
  const connectedNetworkId = useMemo(() => getNetworkIdByChainId(chainId), [chainId])
  const { createNftMutateAsync, resetCreateNft } = useCreateNft()
  const { selectedNft } = usePromptContext()
  const { putOncSaleMutateAsync } = usePutOnSale()
  const dropDownItems = useMemo(() => {
    return chainId === CHAIN_ID.polygon ? DROPDOWN_OPTIONS_POLY : DROPDOWN_OPTIONS_ETH
  }, [chainId])
  const verifyingContractAddress = useMemo(() => marketplaceValidatorContractAddress(chainId), [chainId])
  const marketplaceContractAddress = useMemo(() => getMarketplaceContractAddress(chainId), [chainId])
  const [collectionList, setCollectionList] = useState([{ name: '', value: '' }]) // State to store selected collection
  const defaultContractAddress = useMemo(() => getDefaultContractAddress(chainId), [chainId])

  const [selectedCollection, setSelectedCollection] = useState<Option>({ name: '', value: '' })

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required.'),
    description: Yup.string().required('Description is required.'),
    collection: Yup.string(),
    isShowPromptPublicly: Yup.boolean().required('Required'),
    startingTime: Yup.date(),
    closingTime: Yup.date(),
    agreement: userData?.isAgreementSigned
      ? Yup.boolean()
      : Yup.boolean().oneOf([true], 'You must accept creator agreement to list your item'),
    image: Yup.string().required('Image is Required'),
    fields: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Name is required.'),
        value: Yup.string().required('Value is required.'),
      })
    ),
    royalties: Yup.number()
      .max(100)
      .min(1)
      .required('Royalties is required')
      .test(
        'noEOrSign', // type of the validator (should be unique)
        "Royalties can't be in decimal", // error message
        value => !value.toString().includes('.')
      ),
    amount: isListing
      ? Yup.string()
          .matches(/^\d+(\.\d+)?$/, 'Must be a valid number')
          .required('Number is required')
          .test('validNumber', 'Price cannot be zero', value => {
            const numericValue = parseFloat(value)
            return numericValue !== 0 // Return true if the value is not zero
          })
          .test('maxDigitsAfterDot', 'Number must have at most 14 digits after the dot', value => {
            const dotIndex = value.indexOf('.')
            if (dotIndex !== -1) {
              const digitsAfterDot = value.length - dotIndex - 1
              return digitsAfterDot <= 14
            }
            return true // If there is no dot or fewer than 14 digits after the dot
          })
      : Yup.string(),
  })

  const initialValues = {
    title: '',
    description: '',
    royalties: '',
    collection: '',
    auctionType: AUCTION_TYPES.FIXED,
    agreement: false,
    fields: [],
    image: '',
    amount: '',
    network_id: connectedNetworkId,
    startingTime: formatDateTime(new Date()),
    closingTime: formatDateTime(new Date(new Date().getTime() + 5 * 60 * 1000)),
    isShowPromptPublicly: false,
    generatedImageId: '',
  } as unknown as FormikInitialValues

  const formik = useFormik<FormikInitialValues>({
    initialValues,
    validationSchema,
    onSubmit: async values => {
      const startingTime = convertDate2UTCTimeStamp(new Date(values.startingTime))
      const closingTime =
        values.auctionType === AUCTION_TYPES.FIXED ? 0 : convertDate2UTCTimeStamp(new Date(values.closingTime))

      const createData = {
        title: values.title,
        description: values.description,
        network_id: connectedNetworkId,
        collection_id: values.collection,
        customFields: JSON.stringify(values.fields),
        imageUrl: values.image,
        royalties: values.royalties,
        generatedImageId: values.generatedImageId,
        isShowPromptPublicly: values.isShowPromptPublicly,
        isAgreementSigned: values?.agreement,
      }

      try {
        setIsLoading(true)
        const res = await createNftMutateAsync(createData)
        const createdNftId = res?.data?.id
        if (createdNftId && isListing) {
          let approvalRes: any = await readContracts(config, {
            contracts: [
              {
                address: values.collection.toLowerCase() as AddressString,
                abi: ABIS.collectionERC721 as any,
                functionName: 'isApprovedForAll',
                args: [String(address), marketplaceContractAddress as AddressString],
              },
            ],
          })
          if (!approvalRes[0]?.result) {
            approvalRes = await writeContract(config, {
              address: values.collection as AddressString,
              abi: ABIS.collectionERC721 as any,
              functionName: 'setApprovalForAll',
              args: [marketplaceContractAddress as AddressString, true],
            })
          }
          if (approvalRes[0]?.result || approvalRes) {
            const getNonce: any = await readContracts(config, {
              contracts: [
                {
                  address: marketplaceContractAddress as AddressString,
                  abi: ABIS.marketPlace as any,
                  functionName: 'getCurrentOrderNonce',
                  args: [String(address)],
                },
              ],
            })

            if (getNonce[0]?.status === 'success') {
              let tokenId = ''

              if (values.collection != defaultContractAddress) {
                const safeMintRes = await writeContract(config, {
                  address: values.collection as AddressString,
                  abi: ABIS.collectionERC721 as any,
                  functionName: 'safeMint',
                  args: [
                    address as AddressString,
                    `https://gateway.pinata.cloud/ipfs/${res.data.ipfsHash}`,
                    address as AddressString,
                    Number(values.royalties) * 100,
                  ],
                })
                const safeMintTransactionReceipt = await waitForTransactionReceipt(config, { hash: safeMintRes })

                const iface = new Interface(ABIS.collectionERC721)
                const transactionReceipt = safeMintTransactionReceipt

                const logs = transactionReceipt.logs

                for (const log of logs) {
                  const parsedLog = iface.parseLog(log)

                  if (parsedLog?.name === 'Transfer') {
                    tokenId = parsedLog?.args[2].toString()
                  }
                }
              }
              const signVal: ListingSignPayload = {
                seller: address as AddressString,
                contractAddress: values.collection as AddressString,
                royaltyFee: Number(values.royalties) * 100,
                royaltyReceiver: address as AddressString,
                paymentToken: selectedToken.address as AddressString,
                basePrice: parseUnits(values.amount).toString(),
                listingTime: startingTime,
                expirationTime: closingTime,
                nonce: getNonce[0].result.toString(),
                tokenId: tokenId ?? 0,
                supply: 1,
                value: parseUnits(values.amount).toString(),
                nftType: 0,
                orderType: 0,
                uri: res?.data?.ipfsHash,
                objId: res?.data?.id,
              }

              setStatusMessageStep('Step 2')
              setStatusMessageHead('Mint...')
              const getsignature = await signTypedData(config, {
                domain: {
                  name: SETTINGS.name,
                  version: SETTINGS.version,
                  chainId: chainId !== undefined ? BigInt(chainId) : BigInt(0),
                  verifyingContract: verifyingContractAddress as AddressString,
                },
                types: {
                  EIP712Domain: [
                    { name: 'name', type: 'string' },
                    { name: 'version', type: 'string' },
                    { name: 'chainId', type: 'uint256' },
                    { name: 'verifyingContract', type: 'address' },
                  ],
                  Order: [
                    { name: 'seller', type: 'address' },
                    { name: 'contractAddress', type: 'address' },
                    { name: 'royaltyFee', type: 'uint256' },
                    { name: 'royaltyReceiver', type: 'address' },
                    { name: 'paymentToken', type: 'address' },
                    { name: 'basePrice', type: 'uint256' },
                    { name: 'listingTime', type: 'uint256' },
                    { name: 'expirationTime', type: 'uint256' },
                    { name: 'nonce', type: 'uint256' },
                    { name: 'tokenId', type: 'uint256' },
                    { name: 'supply', type: 'uint256' },
                    { name: 'value', type: 'uint256' },
                    { name: 'nftType', type: 'uint8' },
                    { name: 'orderType', type: 'uint8' },
                    { name: 'uri', type: 'string' },
                    { name: 'objId', type: 'string' },
                  ],
                },
                primaryType: 'Order',
                message: signVal,
              })
              signVal.signature = getsignature
              const verifysignature = await readContracts(config, {
                contracts: [
                  {
                    address: verifyingContractAddress as AddressString,
                    abi: ABIS.verifySignature as any,
                    functionName: '_verifyOrderSig',
                    args: [signVal],
                  },
                ],
              })

              if (verifysignature[0]?.status === 'success') {
                const createPutOnSaleFixed: OnSaleQuery = {
                  auctionType: values.auctionType,
                  amount: parseUnits(values.amount).toString(),
                  startingTime, // Assign Unix timestamps to API parameters
                  closingTime,
                  nonce: getNonce[0]?.result.toString(),
                  signature: getsignature,
                  _id: createdNftId,
                  erc20_address: selectedToken.address as AddressString,
                  connectedNetworkId: connectedNetworkId,
                  ...(values.collection !== defaultContractAddress && { tokenId: tokenId }),
                }

                const createPutOnSaleAuction: OnSaleQuery = {
                  auctionType: values.auctionType,
                  amount: parseUnits(values.amount).toString(),
                  startingTime, // Assign Unix timestamps to API parameters
                  closingTime,
                  nonce: getNonce[0]?.result.toString(),
                  signature: getsignature,
                  _id: createdNftId,
                  erc20_address: selectedToken.address as AddressString,
                  connectedNetworkId: connectedNetworkId,
                  ...(values.collection !== defaultContractAddress && { tokenId: tokenId }),
                }
                const finalDataQuery =
                  formik.values.auctionType === AUCTION_TYPES.FIXED ? createPutOnSaleFixed : createPutOnSaleAuction

                putOncSaleMutateAsync({
                  ...finalDataQuery,
                })
                  .then(resultData => {
                    if (resultData.status) {
                      toast.success('Success! Your NFT has been listed.')
                      router.push(`/nft/${createdNftId}`)
                      setIsLoading(false)
                    } else {
                      setIsLoading(false)
                      toast.error(resultData.message)
                    }
                  })
                  .catch(err => {
                    setIsLoading(false)
                    toast.error('Oops! Listing your NFT failed. Please try again.')
                    console.error('error ', err)
                  })
              } else {
                setIsLoading(false)
                toast.error('Signature verification failed')
              }
            }
            setIsLoading(false)
          }
        } else if (res.status) {
          toast.success(res.message)
          router.push(`/nft/${createdNftId}`)
          setIsLoading(false)
        } else {
          setIsLoading(false)
          toast.error(res.message)
        }
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        toast.error('Oops! Listing your NFT failed. Please try again.')
        console.error('error ', error)
      }
    },
  })

  const handleAddField = () => {
    formik.setFieldValue('fields', [...formik.values.fields, { name: '', value: '' }])
  }

  const handleRemoveField = (index: number) => {
    const newFields = [...formik.values.fields]
    newFields.splice(index, 1)
    formik.setFieldValue('fields', newFields)
  }

  const handleShowPrompt = (value: boolean) => {
    formik.setFieldValue('isShowPromptPublicly', value)
  }

  const handleAgreement = (value: boolean) => {
    formik.setFieldValue('agreement', value)
  }

  const handleSaleType = (value: string) => {
    formik.setFieldValue('auctionType', value)
    formik.setFieldValue('amount', '')
    formik.setFieldTouched('amount', false)
    formik.setFieldError('amount', '')
  }

  const handleCreateCollection = () => {
    setCollectionModal(true)
  }

  const handleCollection = (value: Option) => {
    setSelectedCollection(value)
    formik.setFieldValue('collection', value.value)
  }

  const handleCancel = () => {
    resetCreateNft()
    setIsLoading(false)
  }

  const handleToggleChange = (isChecked: boolean) => {
    setisListing(isChecked)
    if (!isChecked) {
      formik.setFieldError('startingTime', '')
      formik.setFieldError('closingTime', '')
      formik.setFieldError('amount', '')
    }
  }

  const handleSelectedPaymentType = (value: Option) => {
    setSelectedToken({ address: value.value.toString(), title: value.name })
  }

  useEffect(() => {
    if (!selectedNft && address) {
      toast.info('Please select a image first')
      router.push(`/profile/${address}`)
    } else {
      formik.setFieldValue('image', selectedNft?.imageUrl)
      formik.setFieldValue('generatedImageId', selectedNft?.id)
    }
  }, [selectedNft, address])

  useEffect(() => {
    const handler = async () => {
      try {
        const networkId = connectedNetworkId

        const resultData = await getPlatformFeeMutateAsync(networkId)
        if (resultData && resultData.data && Array.isArray(resultData.data)) {
          const filteredData = resultData.data.filter(item => item.networkId === networkId)
          const finalValue = filteredData.map(item => item.platformFee)
          setPlatformFee(finalValue)
        } else {
          console.error('Platform fee data is not in the expected format')
        }
      } catch (error) {
        console.error('Error fetching or filtering platform fee data:', error)
      }
    }

    handler()
  }, [chainId])

  const handleModalClose = async () => {
    const updatedCollectionList = await getCustomCollectionListMutateAsync(connectedNetworkId)
    const newCollectionList = updatedCollectionList.data.map(
      (item: { displayName: string; collectionAddress: string }) => ({
        name: item.displayName,
        value: item.collectionAddress || '',
      })
    )
    setCollectionList(newCollectionList)
    setSelectedCollection(newCollectionList[newCollectionList.length - 1])
    formik.setFieldValue('collection', newCollectionList[newCollectionList.length - 1].value)
  }

  useEffect(() => {
    const fetchCollectionList = async () => {
      try {
        const resultData = await getCustomCollectionListMutateAsync(connectedNetworkId)
        if (resultData.status) {
          const newCollectionList = resultData.data.map((item: { displayName: string; collectionAddress: string }) => ({
            name: item.displayName,
            value: item.collectionAddress || '',
          }))

          setCollectionList(newCollectionList)
          formik.setFieldValue('collection', newCollectionList[0].value)
          setSelectedCollection(newCollectionList[0])
        } else {
          console.error('Failed to fetch Collection List. Please try again')
        }
      } catch (error) {
        console.error('Failed to fetch Collection List. Please try again', error)
      }
    }
    fetchCollectionList()
  }, [chainId])

  return (
    <main className="mt-12">
      <div className="container">
        <div className="mb-[120px] flex flex-col-reverse justify-between gap-14 slg:flex-row">
          <div className="w-full slg:w-[60%]">
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-col gap-8">
                <Typography size="title">Mint your nft</Typography>
                <Input
                  className="  !w-[100%]"
                  error={formik.errors.title && formik.touched.title ? formik.errors.title : ''}
                  label="Title"
                  placeholder="Item Name"
                  {...formik.getFieldProps('title')}
                />
                <TextAreaInput
                  className="  !w-[100%]"
                  error={formik.errors.description && formik.touched.description ? formik.errors.description : ''}
                  label="Description"
                  placeholder="Provide a detailed description of your item."
                  rows={4}
                  {...formik.getFieldProps('description')}
                />
                {/* Sale modal  */}
                <div>
                  <div className="flex flex-row justify-between pb-[16px] ">
                    <Typography className=" text-left font-Urbanist  text-lg font-bold leading-[145%] text-neutral-100 dark:text-neutral-800">
                      Choose your sale modal
                    </Typography>
                    <Toggle defaultCheck={isListing} onChange={handleToggleChange} />
                  </div>
                  {isListing && (
                    <div className="flex justify-start gap-3">
                      <Button
                        variant={formik.values.auctionType === '1' ? 'solid' : 'outlined'}
                        onClick={() => handleSaleType('1')}
                      >
                        Fixed Price
                      </Button>

                      <Button
                        variant={formik.values.auctionType === '2' ? 'solid' : 'outlined'}
                        onClick={() => handleSaleType('2')}
                      >
                        Auction
                      </Button>
                      <div className="flex w-1/4 flex-col">
                        <DropDown
                          data={dropDownItems}
                          defaultValue={dropDownItems[0]}
                          onChange={value => handleSelectedPaymentType(value as Option)}
                        />
                      </div>
                    </div>
                  )}
                  <div className="mt-8">
                    {isListing && (
                      <>
                        <Input
                          className="  !w-[100%]"
                          error={formik.errors.amount && formik.touched.amount ? formik.errors.amount : ''}
                          label={
                            isListing && formik.values.auctionType === '1' ? (
                              <>
                                <Typography className="pb-1 text-left font-Urbanist  text-lg font-bold leading-[145%] text-neutral-100 dark:text-neutral-800">
                                  Pricing
                                </Typography>
                                <Typography className="mb-3 text-neutral-500" size="small">
                                  Choose a type of sale - Fixed price, the item is listed at the price you set.
                                </Typography>
                              </>
                            ) : (
                              'Minimum bid'
                            )
                          }
                          placeholder="0"
                          rows={4}
                          {...formik.getFieldProps('amount')}
                        />
                      </>
                    )}
                    {isListing && formik.values.auctionType === AUCTION_TYPES.AUCTION && (
                      <div className="mt-8 flex flex-col gap-3 md:flex-row">
                        <Input
                          className="!w-[100%]"
                          label="Start Date"
                          min={formatDateTime(new Date())}
                          rows={4}
                          type="datetime-local"
                          {...formik.getFieldProps('startingTime')}
                          inputStyle="dark:bg-[#3b3b3b]"
                        />
                        <Input
                          className="!w-[100%]"
                          label="End Date"
                          min={formatDateTime(new Date(new Date(formik.values.startingTime).getTime() + 5 * 60 * 1000))}
                          rows={4}
                          type="datetime-local"
                          {...formik.getFieldProps('closingTime')}
                          inputStyle="dark:bg-[#3b3b3b]"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <Input
                  className="!w-[100%]"
                  error={formik.errors.royalties && formik.touched.royalties ? formik.errors.royalties : ''}
                  label="royalties"
                  placeholder="0"
                  {...formik.getFieldProps('royalties')}
                />
                <Input className="!w-[100%]" disabled={true} label="Platform Fee" readOnly={true} value={platformFee} />

                {/* Collection */}
                <div>
                  <Typography className="pb-1 text-left font-Urbanist  text-lg font-bold leading-[145%] text-neutral-100 dark:text-neutral-800">
                    Collection
                  </Typography>
                  <Typography className="mb-3 text-neutral-500" size="small">
                    Choose a type of sale - Fixed price, the item is listed at the price you set.
                  </Typography>
                  <div className=" flex items-center justify-start gap-3">
                    <DropDown
                      data={collectionList}
                      defaultValue={selectedCollection}
                      onChange={value => handleCollection(value as Option)}
                    />
                    <Button
                      className="h-fit w-[15%] min-w-[96px] !px-4 !py-3"
                      variant="outlined"
                      onClick={handleCreateCollection}
                    >
                      Create
                    </Button>
                  </div>
                </div>
                <div className="  rounded-sm bg-pink-900 px-8 py-6 backdrop-blur-2xl dark:bg-neutral-200">
                  <div className="dark:bg-ne flex flex-col justify-between gap-6 rounded-sm bg-[#ffffff3d] p-6 backdrop-blur-2xl  dark:bg-neutral-300">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4">
                        <OptionIcon />
                        <Typography className="text-neutral-100 dark:text-neutral-800" size="paragraph">
                          Properties
                        </Typography>
                      </div>
                      <div className="cursor-pointer " onClick={handleAddField}>
                        <IconPlus className="" />
                      </div>
                    </div>

                    {formik.values.fields.map((_field, index: number) => (
                      <div className="flex items-center justify-between gap-3" key={index}>
                        <div>
                          <Input
                            error={
                              formik.touched.fields?.[index]?.name &&
                              (formik.errors.fields as FormikErrors<{ name: string; value: string }>[])?.[index]?.name
                                ? (formik.errors.fields as FormikErrors<{ name: string; value: string }>[])?.[index]
                                    ?.name
                                : ''
                            }
                            label="Name"
                            placeholder="Enter field name"
                            type="text"
                            {...formik.getFieldProps(`fields[${index}].name`)}
                          />
                        </div>
                        <div>
                          <Input
                            error={
                              formik.touched.fields?.[index]?.name &&
                              (formik.errors.fields as FormikErrors<{ name: string; value: string }>[])?.[index]?.value
                                ? (formik.errors.fields as FormikErrors<{ name: string; value: string }>[])?.[index]
                                    ?.value
                                : ''
                            }
                            label="Value"
                            placeholder="Enter field value"
                            type="text"
                            {...formik.getFieldProps(`fields[${index}].value`)}
                          />
                        </div>
                        <Button
                          className="mt-8 h-fit  w-[30%] p-2"
                          type="button"
                          onClick={() => handleRemoveField(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <Typography className="pb-1 text-left font-Urbanist  text-lg font-bold leading-[145%] text-neutral-100 dark:text-white">
                    Show prompt publicly
                  </Typography>
                  <div className="mt-4 flex items-center justify-start gap-4">
                    <Toggle defaultCheck={formik.values.isShowPromptPublicly} onChange={handleShowPrompt} />
                    <Typography className="text-neutral-400 dark:text-neutral-500" size="paragraph">
                      Activate this if you wish to feature your item/collection on our Explore page
                    </Typography>
                  </div>
                </div>
                {!userData?.isAgreementSigned ? (
                  <div className="mt-10">
                    <div className=" mt-4 flex justify-between">
                      <Typography className=" pb-1 text-left font-Urbanist text-lg  font-bold leading-[145%] text-neutral-100 dark:text-white">
                        Creator Agreement
                      </Typography>
                      <Checkbox checked={formik.values.agreement} onChange={handleAgreement} />
                    </div>
                    <Typography className=" mt-[18px] text-neutral-400 dark:text-neutral-500" size="paragraph">
                      <Link className="hover:text-pink-700" href={'/terms-and-condition'} target={'_blank'}>
                        {' '}
                        Read and accept the Creator agreement to list your item
                      </Link>
                    </Typography>
                    {formik.errors.agreement && formik.touched.agreement && (
                      <p className=" text-error-800">{formik.errors.agreement}</p>
                    )}
                  </div>
                ) : (
                  ''
                )}
                <Button
                  className="mt-[51px] w-fit  self-center rounded-lg bg-black text-white"
                  disabled={isLoading}
                  type="submit"
                >
                  {isLoading ? (
                    <>
                      <Spinner className="animate-spin" />
                      &nbsp; Creating...
                    </>
                  ) : (
                    'Create Now'
                  )}
                </Button>
              </div>
            </form>
          </div>
          <div className="w-full slg:w-[40%]">
            <Typography size="title">Preview</Typography>
            <div className="mt-4">
              {selectedNft?.imageUrl ? (
                <NftCard src={selectedNft?.imageUrl} variant="mint preview" isLink={false} />
              ) : (
                <div className="flex h-[422px] w-full items-center justify-center rounded-sm border border-neutral-600 dark:border-neutral-400">
                  <Typography className=" text-error-800" size="bold-paragraph">
                    Image not found
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <MintingLoadingModal
        handleCancel={handleCancel}
        open={isLoading}
        setIsModalOpen={resetCreateNft}
        statusMessageHead={statusMessageHead}
        statusMessageStep={statusMessageStep}
      />
      <CollectionModal
        handleCreate={() => false}
        open={collectionModal}
        setIsModalOpen={() => setCollectionModal(false)}
        onCollectionCreated={handleModalClose}
      />
    </main>
  )
}

export default MintNftTemplate
