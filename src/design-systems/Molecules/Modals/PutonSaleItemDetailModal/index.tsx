import React, { useEffect, useMemo, useState } from 'react'
import { useFormik } from 'formik'
import { useAccount } from 'wagmi'
import { readContracts, signTypedData, writeContract, waitForTransactionReceipt } from '@wagmi/core'
import { Interface, parseUnits } from 'ethers'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import Modal from '@/design-systems/Atoms/Modal'
import Typography from '@/design-systems/Atoms/Typography'
import Button from '@/design-systems/Atoms/Button'
import Input from '@/design-systems/Atoms/Input'
import { usePutOnSale } from '@/hooks/ApiHooks/usePutOnSale'
import ABIS from '@/app/abis'
import {
  AUCTION_TYPES,
  CHAIN_ID,
  getCollectionFactoryContractAddress,
  DROPDOWN_OPTIONS_ETH,
  DROPDOWN_OPTIONS_POLY,
  getMarketplaceContractAddress,
  marketplaceValidatorContractAddress,
  SETTINGS,
  convertDate2UTCTimeStamp,
  formatDateTime,
  getNetworkIdByChainId,
  getDefaultContractAddress,
} from '@/utils'
import { AddressString } from '@/interfaces'
import { config } from '@/context/wagmiContext/config'
import { usePromptContext } from '@/context/PromptContext'
import { ListingSignPayload } from '@/design-systems/Templates/MintNftTemplate/interface'
import { OnSaleQuery } from '@/api-services/interfaces/home'
import DropDown from '@/design-systems/Atoms/DropDown'
import { Option } from '@/design-systems/Atoms/DropDown/interface'
import { ItemDetails } from '@/api-services/interfaces/item-details'
import { getItemDetails } from '@/api-services/ItemDetailService'
import Spinner from '@/design-systems/Atoms/Spinner'

interface selectedTokenProps {
  address: string
  title: string
}
interface PutOnSaleItemDetailModalProps {
  handleClose: () => void
  open: boolean
  data: ItemDetails
  setIsOpenPutOnSaleModal: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedToken: React.Dispatch<React.SetStateAction<selectedTokenProps>>
  selectedToken: selectedTokenProps
  setData: React.Dispatch<React.SetStateAction<ItemDetails>>
}

const PutOnSaleItemDetailModal: React.FC<PutOnSaleItemDetailModalProps> = ({
  handleClose,
  open,
  data,
  setSelectedToken,
  selectedToken,
  setIsOpenPutOnSaleModal,
  setData,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { putOncSaleMutateAsync } = usePutOnSale()
  const { chainId } = useAccount()
  const { address } = useAccount()
  const { selectedNft } = usePromptContext()
  const [isFixedPriceSelected, setIsFixedPriceSelected] = useState('')

  const collectionFactoryContractAddress = useMemo(() => getCollectionFactoryContractAddress(chainId), [chainId])
  const marketplaceContractAddress = useMemo(() => getMarketplaceContractAddress(chainId), [chainId])
  const verifyingContractAddress = useMemo(() => marketplaceValidatorContractAddress(chainId), [chainId])
  const connectedNetworkId = useMemo(() => getNetworkIdByChainId(chainId), [chainId])
  const defaultContractAddress = useMemo(() => getDefaultContractAddress(chainId), [chainId])
  const dropDownItems = useMemo(() => {
    return chainId === CHAIN_ID.polygon ? DROPDOWN_OPTIONS_POLY : DROPDOWN_OPTIONS_ETH
  }, [chainId])

  const initialErrorState = {
    amountError: '',
    closingTimeError: '',
    startingTimeError: '',
  }
  const [validationError, setValidationError] = useState(initialErrorState)

  const validationSchema = Yup.object({
    saleType: Yup.string().required('Required'),
    minBid: Yup.string()
      .when('it is required', {
        is: () => isFixedPriceSelected === AUCTION_TYPES.AUCTION,
        then: schema => schema.required('Minimum Bid is Required'),
        otherwise: schema => schema.notRequired(),
      })
      .matches(/^\d+(\.\d+)?$/, 'Must be a valid number')
      .required('Number is required')
      .test('validNumber', 'Price cannot be zero', value => {
        if (typeof value === 'undefined') {
          return true // Return true if value is undefined
        }
        const numericValue = parseFloat(value)
        return numericValue !== 0 // Return true if the value is not zero
      })
      .test('maxDigitsAfterDot', 'Number must have at most 14 digits after the dot', value => {
        if (typeof value === 'undefined') {
          return true // Return true if value is undefined
        }
        const dotIndex = value.indexOf('.')
        if (dotIndex !== -1) {
          const digitsAfterDot = value.length - dotIndex - 1
          return digitsAfterDot <= 14
        }
        return true // If there is no dot or fewer than 14 digits after the dot
      }),
    pricing: Yup.string()
      .when('it is required', {
        is: () => isFixedPriceSelected === AUCTION_TYPES.FIXED,
        then: schema => schema.required('Pricing is Required'),
        otherwise: schema => schema.notRequired(),
      })
      .matches(/^\d+(\.\d+)?$/, 'Must be a valid number')
      .required('Number is required')
      .test('validNumber', 'Price cannot be zero', value => {
        if (typeof value === 'undefined') {
          return true // Return true if value is undefined
        }
        const numericValue = parseFloat(value)
        return numericValue !== 0 // Return true if the value is not zero
      })
      .test('maxDigitsAfterDot', 'Number must have at most 14 digits after the dot', value => {
        if (typeof value === 'undefined') {
          return true // Return true if value is undefined
        }
        const dotIndex = value.indexOf('.')
        if (dotIndex !== -1) {
          const digitsAfterDot = value.length - dotIndex - 1
          return digitsAfterDot <= 14
        }
        return true // If there is no dot or fewer than 14 digits after the dot
      }),

    startingTime: Yup.date(),
    closingTime: Yup.date(),
  })

  const formik = useFormik({
    initialValues: {
      saleType: AUCTION_TYPES.FIXED,
      minBid: '',
      startingTime: formatDateTime(new Date()),
      closingTime: formatDateTime(new Date(new Date().getTime() + 5 * 60 * 1000)),
      minExpiryDate: '',
      pricing: '',
      image: '',
      generatedImageId: collectionFactoryContractAddress,
      collection: collectionFactoryContractAddress,
    },

    validationSchema,

    onSubmit: async values => {
      switch (values.startingTime) {
        case null:
        case undefined:
          setValidationError({
            ...validationError,
            startingTimeError: 'Cannot be empty. Please Select Start Date',
          })
          break
        default:
          setValidationError({
            ...validationError,
            startingTimeError: '',
          })
          break
      }

      const startingTime = AUCTION_TYPES.FIXED
        ? convertDate2UTCTimeStamp(new Date())
        : convertDate2UTCTimeStamp(new Date(values.startingTime))
      const closingTime =
        values.saleType === AUCTION_TYPES.FIXED ? 0 : convertDate2UTCTimeStamp(new Date(values.closingTime))
      try {
        const buyPrice =
          values.saleType === AUCTION_TYPES.FIXED
            ? parseUnits(values.pricing).toString()
            : parseUnits(values.minBid).toString()
        setIsLoading(true)
        const createdNftId = data._id
        if (createdNftId) {
          let approvalRes: any = await readContracts(config, {
            contracts: [
              {
                address: data.collection_address as AddressString,
                abi: ABIS.collectionERC721 as any,
                functionName: 'isApprovedForAll',
                args: [String(address), marketplaceContractAddress as AddressString],
              },
            ],
          })

          if (!approvalRes[0]?.result) {
            approvalRes = await writeContract(config, {
              address: data.collection_address as AddressString,
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
              if (data.collection_address != defaultContractAddress) {
                const safeMintRes = await writeContract(config, {
                  address: data.collection_address as AddressString,
                  abi: ABIS.collectionERC721 as any,
                  functionName: 'safeMint',
                  args: [
                    address as AddressString,
                    `https://gateway.pinata.cloud/ipfs/${data.ipfs_hash}`,
                    address as AddressString,
                    Number(data.royalties) * 100,
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
                contractAddress: data.collection_address as AddressString,
                royaltyFee: Number(data.royalties) * 100,
                royaltyReceiver: address as AddressString,
                paymentToken: selectedToken.address as AddressString,
                basePrice: buyPrice,
                listingTime: startingTime,
                expirationTime: closingTime,
                nonce: getNonce[0].result.toString(),
                tokenId: tokenId != '' ? tokenId : data.token_id ?? 0,
                supply: 1,
                value: buyPrice,
                nftType: 0,
                orderType: 0,
                uri: data.ipfs_hash,
                objId: data._id,
              }

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
                  auctionType: values.saleType,
                  amount: buyPrice,
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
                  auctionType: values.saleType,
                  amount: buyPrice,
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
                  formik.values.saleType === AUCTION_TYPES.FIXED ? createPutOnSaleFixed : createPutOnSaleAuction
                putOncSaleMutateAsync({
                  ...finalDataQuery,
                })
                  .then(resultData => {
                    if (resultData.status) {
                      setIsOpenPutOnSaleModal(false)
                      toast.success('Success! Your NFT has been listed.')
                      getItemDetails({ collectible_id: data._id }).then(data => {
                        return setData(data.data)
                      })
                      setIsLoading(false)
                    } else {
                      setIsOpenPutOnSaleModal(false)
                      toast.error(resultData.message)
                      setIsLoading(false)
                    }
                  })
                  .catch(err => {
                    console.error('error ', err.response.data)
                    setIsOpenPutOnSaleModal(false)
                    toast.error('Oops! Listing your NFT failed. Please try again.')
                    setIsLoading(false)
                  })
              } else {
                setIsLoading(false)
                setIsOpenPutOnSaleModal(false)
                toast.error('Signature verification failed')
              }
            }
          }
        } else {
          setIsLoading(false)
          setIsOpenPutOnSaleModal(false)
          toast.error('Oops! Listing your NFT failed. Please try again.')
        }
      } catch (error) {
        console.error('error ', error)
        setIsLoading(false)
        setIsOpenPutOnSaleModal(false)
        toast.error('Oops! Listing your NFT failed. Please try again.')
      }
    },
  })

  useEffect(() => {
    formik.setFieldValue('image', selectedNft?.imageUrl)
    formik.setFieldValue('generatedImageId', selectedNft?.id)
  }, [selectedNft])

  const handlePaymentOptions = (value: Option) => {
    setSelectedToken({ title: value.name, address: value.value.toString() })
  }

  const handleFixedPriceButtonClick = () => {
    setIsFixedPriceSelected(AUCTION_TYPES.FIXED)
    formik.setFieldValue('saleType', AUCTION_TYPES.FIXED)
  }

  const handleAuctionButtonClick = () => {
    setIsFixedPriceSelected(AUCTION_TYPES.AUCTION)
    formik.setFieldValue('saleType', AUCTION_TYPES.AUCTION)
  }

  return (
    <Modal handleClose={handleClose} label="Put on sale" open={open}>
      <form onSubmit={formik.handleSubmit}>
        <div className="">
          <div className="flex justify-start gap-3">
            <Button
              variant={formik.values.saleType === AUCTION_TYPES.FIXED ? 'solid' : 'outlined'}
              onClick={handleFixedPriceButtonClick}
            >
              Fixed Price
            </Button>

            <Button
              variant={formik.values.saleType === AUCTION_TYPES.AUCTION ? 'solid' : 'outlined'}
              onClick={handleAuctionButtonClick}
            >
              Auction
            </Button>

            <div className="flex w-1/4 flex-col">
              <DropDown
                data={dropDownItems}
                defaultValue={dropDownItems?.[0]}
                onChange={value => handlePaymentOptions(value as Option)}
              />
            </div>
          </div>

          {formik.values.saleType === AUCTION_TYPES.AUCTION && (
            <div className="mt-4">
              <Input
                className="!w-[100%]"
                error={formik.errors.minBid && formik.touched.minBid ? formik.errors.minBid : ''}
                label="Minimum bid"
                placeholder=""
                rows={4}
                {...formik.getFieldProps('minBid')}
              />
              <div className="mt-4 flex flex-col gap-3">
                <Input
                  className="!w-[100%]"
                  error={formik.errors.startingTime && formik.touched.startingTime ? formik.errors.startingTime : ''}
                  label="Start Date"
                  placeholder=""
                  rows={4}
                  type="datetime-local"
                  {...formik.getFieldProps('startingTime')}
                  inputStyle="dark:bg-[#3b3b3b]"
                  min={formatDateTime(new Date())}
                />

                <Input
                  className="!w-[100%]"
                  error={formik.errors.closingTime && formik.touched.closingTime ? formik.errors.closingTime : ''}
                  label="End Date"
                  placeholder=""
                  rows={4}
                  type="datetime-local"
                  {...formik.getFieldProps('closingTime')}
                  inputStyle="dark:bg-[#3b3b3b]"
                  min={formatDateTime(new Date(new Date(formik.values.startingTime).getTime() + 5 * 60 * 1000))}
                />
              </div>
            </div>
          )}

          {formik.values.saleType === AUCTION_TYPES.FIXED && (
            <div className="mt-4">
              <Typography className="pb-1 text-left font-Urbanist  text-lg font-bold leading-[145%] text-neutral-100 dark:text-neutral-800">
                Pricing
              </Typography>
              <Typography className="mb-3 text-neutral-500" size="small">
                Choose a type of sale - Fixed price, the item is listed at the price you set.
              </Typography>

              <Input
                className="!w-[100%]"
                error={formik.errors.pricing && formik.touched.pricing ? formik.errors.pricing : ''}
                label=""
                placeholder="Provide a detailed description of your item."
                {...formik.getFieldProps('pricing')}
              />
            </div>
          )}
          <Button
            className="mt-[51px] w-fit  self-center rounded-lg bg-black text-white"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <>
                <Spinner className="animate-spin" />
                &nbsp; Loading...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default PutOnSaleItemDetailModal
