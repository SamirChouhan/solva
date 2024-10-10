'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { writeContract, readContracts, waitForTransactionReceipt } from '@wagmi/core'
import { toast } from 'react-toastify'
import { useAccount } from 'wagmi'
import { toBigInt } from 'ethers'
import { parseUnits } from 'ethers'
import Link from 'next/link'
import parse from 'html-react-parser'
import { contractApproveABI, contractEthABI, contractPolyABI } from './utils'
import { Timer } from '@/design-systems/Atoms/Timer'
import Image from '@/design-systems/Atoms/Image'
import Typography from '@/design-systems/Atoms/Typography'
import Button from '@/design-systems/Atoms/Button'
import { config } from '@/context/wagmiContext/config'
import { AddressString } from '@/interfaces'
import ABIS from '@/app/abis'
import { searchData } from '@/api-services/interfaces/auth'
import { useViewCount } from '@/hooks/ApiHooks/useViewCount'
import { useLike } from '@/hooks/ApiHooks/useLike'
import { getItemDetails } from '@/api-services/ItemDetailService'
import PutOnSaleItemDetailModal from '@/design-systems/Molecules/Modals/PutonSaleItemDetailModal'
import { ItemDetails, OnSaveEventNftQuery } from '@/api-services/interfaces/item-details'
import { PriceCard } from '@/design-systems/Molecules/Cards/PriceCard/PriceCard'
import dummyProfileImage from '@/assets/images/dummy-card-img-2.png'
import PlaceABid from '@/design-systems/Molecules/Modals/PlaceABid'
import { useSaveEventNft } from '@/hooks/ApiHooks/useSaveEventNft'
import {
  AUCTION_TYPES,
  CHAIN_ID,
  marketplaceValidatorContractAddress,
  NULL_TOKEN_ADDRESS,
  SOLAV_NETWORKS,
  SOLAV_POLY_TOKEN_ADDRESS,
  SOLAV_TOKEN_ADDRESS,
  compareStringsInsentively,
  formatAddress,
  formatUnits,
  getItemSaleStatus,
  getNftPrice,
  getTokenKey,
  snakeToCamel,
  parseAnchorTags,
  getNetworkIdByChainId,
  ITEM_SALE_STATUS,
} from '@/utils'
import {
  CaretDoubleDownIcon,
  CaretDoubleUpIcon,
  EthereumIcon,
  EyeIcon,
  HeartIcon,
  OutlineCheckIcon,
  OutlineStarIcon,
  PolygonIcon,
  RedStarIcon,
} from '@/design-systems/Atoms/Icons'
import SwitchNetworkModal from '@/design-systems/Molecules/Modals/SwitchNetworkModal'
import { useToggle } from '@/hooks'
import Spinner from '@/design-systems/Atoms/Spinner'

interface ItemMainDetailSectionProps {
  data: ItemDetails
}

export interface selectedTokenProps {
  address: string
  title: string
}

const ItemMainDetailSection: React.FC<ItemMainDetailSectionProps> = ({ data: apiData }) => {
  const { chainId, address } = useAccount()
  const [data, setData] = useState<ItemDetails>(() => apiData)
  const { viewCountMutateAsync } = useViewCount()
  const { saveEventNftMutateAsync } = useSaveEventNft()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedToken, setSelectedToken] = useState<selectedTokenProps>({ address: NULL_TOKEN_ADDRESS, title: 'ETH' })
  const [isOpenPutOnSaleModal, setIsOpenPutOnSaleModal] = useState<boolean>(false)
  const [isOpenlaceABidModal, setIsOpenPlaceABidModal] = useState<boolean>(false)
  const [like, setLike] = useState<boolean>(() => data?.is_like)
  const [likeCount, setLikeCount] = useState(() => data?.total_like)
  const { likeMutation } = useLike()
  const price = useMemo(() => getNftPrice(snakeToCamel(data) as unknown as searchData), [data])
  const [saleStatus, setSaleStatus] = useState<string | undefined>('')
  const [isSwitchNetworkModalOpen, setIsSwitchNetworkModalOpen] = useState(false) // State for managing modal open/close

  const verifyingContractAddress = useMemo(() => marketplaceValidatorContractAddress(chainId), [chainId])
  const connectedNetworkId = useMemo(() => getNetworkIdByChainId(chainId), [chainId])

  const solavToken =
    chainId === CHAIN_ID.polygon ? (SOLAV_POLY_TOKEN_ADDRESS as AddressString) : (SOLAV_TOKEN_ADDRESS as AddressString)
  const collectible_id = data?._id as string
  const handleBuyNFT = async () => {
    if (data.network_id == connectedNetworkId) {
      const promise = new Promise((resolve, reject) => {
        ;(async () => {
          try {
            setIsLoading(true)
            const startingTime = Math.round(new Date(data?.auctionDetails?.startingTime).getTime() / 1000)
            const closingTime = 0
            const contractABI = chainId === CHAIN_ID.polygon ? contractPolyABI : contractEthABI
            const proxyContractAddress = data.auctionDetails.contract_address as AddressString

            const contract_address = data.collection_address as AddressString
            const tokenId = data.token_id ?? 0

            const buyPrice = data.auctionDetails.buyPrice
            const orderTuple = {
              seller: data.collectible_owner as AddressString,
              contractAddress: data.collection_address,
              royaltyFee: Number(data.royalties) * 100,
              royaltyReceiver: data.ownerObj.wallet_address as AddressString,
              paymentToken: data.auctionDetails.erc20Token.toLowerCase(),
              basePrice: buyPrice,
              listingTime: startingTime,
              expirationTime: closingTime,
              nonce: Number(data.auctionDetails.nonce),
              tokenId: tokenId,
              supply: 1,
              value: buyPrice,
              nftType: 0, // nftType 1 : ERC 720, nftType 2 : ERC 1155
              orderType: 0,
              signature: data.auctionDetails.signature as AddressString,
              uri: data.ipfs_hash,
              objId: data._id,
            }
            const verifysignature = await readContracts(config, {
              contracts: [
                {
                  address: verifyingContractAddress as AddressString,
                  abi: ABIS.verifySignature as any,
                  functionName: '_verifyOrderSig',
                  args: [orderTuple],
                },
              ],
            })

            if (
              data.auctionDetails.erc20Token.toLowerCase() === solavToken.toLowerCase() &&
              verifysignature[0].status === 'success'
            ) {
              const resultApproveAllowance = await readContracts(config, {
                contracts: [
                  {
                    address: solavToken,
                    abi: contractApproveABI as any,
                    functionName: 'allowance',
                    args: [address as AddressString, proxyContractAddress],
                  },
                ],
              })

              if (resultApproveAllowance[0].status === 'success') {
                const checkAllowance = BigInt(String(buyPrice)) <= BigInt(String(resultApproveAllowance[0].result))

                if (checkAllowance) {
                  const resultData = await writeContract(config, {
                    abi: contractABI,
                    address: proxyContractAddress,
                    functionName: 'buy',
                    args: [contract_address, tokenId, buyPrice, orderTuple],
                  })

                  const buyTransactionWithSolav = await waitForTransactionReceipt(config, { hash: resultData })

                  if (buyTransactionWithSolav.status === 'success') {
                    const createBuyNftPayload: OnSaveEventNftQuery = {
                      transaction_hash: resultData,
                      contract_address: proxyContractAddress,
                      network_id: data.network_id, // network_id 1 : Ethereum , network_id 2 : Polygon
                    }

                    saveEventNftMutateAsync({
                      ...createBuyNftPayload,
                    })
                      .then(resultData => {
                        if (resultData.status) {
                          getItemDetails({ collectible_id }).then(data => {
                            setData(data.data)
                            setIsLoading(false)
                            resolve(true)
                          })
                        } else {
                          setIsLoading(false)
                          toast.error('Failed to save event detail. Please try again later.')
                          reject()
                        }
                      })
                      .catch(err => {
                        setIsLoading(false)
                        toast.error('Failed to save event detail. Please try again later.')
                        reject()
                        console.error(err)
                      })
                  } else {
                    setIsLoading(false)
                    reject()
                  }
                } else {
                  const resultApprove = await writeContract(config, {
                    abi: contractApproveABI,
                    address: solavToken,
                    functionName: 'approve',
                    args: [proxyContractAddress, buyPrice],
                  })

                  const approveTr = await waitForTransactionReceipt(config, { hash: resultApprove })
                  if (approveTr.status === 'success') {
                    toast.info('Transaction has been approved for SOLAV')

                    const resultData = await writeContract(config, {
                      abi: contractABI,
                      address: proxyContractAddress,
                      functionName: 'buy',
                      args: [contract_address, tokenId, buyPrice, orderTuple],
                    })

                    const buyTransactionWithSolav = await waitForTransactionReceipt(config, { hash: resultData })

                    if (buyTransactionWithSolav.status === 'success') {
                      const createBuyNftPayload: OnSaveEventNftQuery = {
                        transaction_hash: resultData,
                        contract_address: proxyContractAddress,
                        network_id: data.network_id, // network_id 1 : Ethereum , network_id 2 : Polygon
                      }

                      saveEventNftMutateAsync({
                        ...createBuyNftPayload,
                      })
                        .then(resultData => {
                          if (resultData.status) {
                            getItemDetails({ collectible_id }).then(data => {
                              setData(data.data)
                              setIsLoading(false)
                              resolve(true)
                            })
                          } else {
                            setIsLoading(false)
                            toast.error('Failed to save event detail. Please try again later.')
                            reject()
                          }
                        })
                        .catch(err => {
                          setIsLoading(false)
                          toast.error('Failed to save event detail. Please try again later.')
                          console.error(err)
                          reject()
                        })
                    } else {
                      setIsLoading(false)
                      reject()
                    }
                  }
                }
              } else {
                setIsLoading(false)
                reject()
              }
            } else {
              const resultData = await writeContract(config, {
                abi: contractABI,
                address: proxyContractAddress,
                functionName: 'buy',
                args: [contract_address, tokenId, buyPrice, orderTuple],
                value: toBigInt(buyPrice),
              })

              const buyTransaction = await waitForTransactionReceipt(config, { hash: resultData })

              if (buyTransaction.status === 'success') {
                const createBuyNftPayload: OnSaveEventNftQuery = {
                  transaction_hash: resultData,
                  contract_address: proxyContractAddress,
                  network_id: data.network_id,
                }

                saveEventNftMutateAsync({
                  ...createBuyNftPayload,
                })
                  .then(resultData => {
                    if (resultData.status) {
                      getItemDetails({ collectible_id }).then(data => {
                        setData(data.data)
                        setIsLoading(false)
                        resolve(true)
                      })
                    } else {
                      toast.error('Failed to save event detail. Please try again later.')
                      setIsLoading(false)
                      reject()
                    }
                  })
                  .catch(err => {
                    toast.error('Failed to save event detail. Please try again later.')
                    setIsLoading(false)
                    console.error(err)
                    reject()
                  })
              } else {
                setIsLoading(false)
                reject()
              }
            }
          } catch (err) {
            setIsLoading(false)
            console.error(err)
            reject()
          }
        })()
      })

      toast.promise(promise, {
        pending: "Don't Refresh...Transaction is in Progress ",
        success: 'Congratulations! You have successfully bought the NFT.',
        error: 'Oops! Failed to buy the NFT. Please try again later.',
      })
    } else {
      setIsSwitchNetworkModalOpen(true)
    }
  }

  const handleBidNFT = async (offerPrice: string) => {
    const promise = new Promise((resolve, reject) => {
      ;(async () => {
        try {
          setIsLoading(true)

          const finalPrice = parseUnits(offerPrice).toString()

          const startingTime = Math.round(new Date(data?.auctionDetails?.startingTime).getTime() / 1000)
          const closingTime = Math.round(new Date(data?.auctionDetails?.initialClosingTime).getTime() / 1000)

          const contractABI = chainId === CHAIN_ID.polygon ? contractPolyABI : contractEthABI
          const proxyContractAddress = data.auctionDetails.contract_address as AddressString

          const buyPrice = data.auctionDetails.startingPrice

          const orderTuple = {
            seller: data.collectible_owner as AddressString,
            contractAddress: data.collection_address,
            royaltyFee: Number(data.royalties) * 100,
            royaltyReceiver: data.ownerObj.wallet_address as AddressString,
            paymentToken: data.auctionDetails.erc20Token,
            basePrice: buyPrice,
            listingTime: startingTime,
            expirationTime: closingTime,
            nonce: Number(data.auctionDetails.nonce),
            tokenId: data.token_id ?? 0,
            supply: 1,
            value: buyPrice,
            nftType: 0,
            orderType: 0,
            signature: data.auctionDetails.signature as AddressString,
            uri: data.ipfs_hash,
            objId: data._id,
          }

          const verifysignature = await readContracts(config, {
            contracts: [
              {
                address: verifyingContractAddress as AddressString,
                abi: ABIS.verifySignature as any,
                functionName: '_verifyOrderSig',
                args: [orderTuple],
              },
            ],
          })

          if (verifysignature && data.auctionDetails.erc20Token.toLowerCase() === solavToken.toLowerCase()) {
            const resultApproveAllowance = await readContracts(config, {
              contracts: [
                {
                  address: solavToken,
                  abi: contractApproveABI as any,
                  functionName: 'allowance',
                  args: [address as AddressString, proxyContractAddress],
                },
              ],
            })

            if (resultApproveAllowance[0].status === 'success') {
              const checkAllowance =
                BigInt(parseUnits(String(offerPrice))) <= BigInt(String(resultApproveAllowance[0].result))

              if (checkAllowance) {
                const resultData = await writeContract(config, {
                  abi: contractABI,
                  address: proxyContractAddress,
                  functionName: 'bidding',
                  args: [orderTuple, finalPrice],
                })

                const biddTransactionWithSolav = await waitForTransactionReceipt(config, { hash: resultData })

                if (biddTransactionWithSolav?.status === 'success') {
                  const createBuyNftPayload: OnSaveEventNftQuery = {
                    transaction_hash: resultData,
                    contract_address: proxyContractAddress,
                    network_id: data.network_id,
                  }

                  saveEventNftMutateAsync({
                    ...createBuyNftPayload,
                  })
                    .then(resultData => {
                      if (resultData.status) {
                        getItemDetails({ collectible_id }).then(data => {
                          setData(data.data)
                          setIsLoading(false)
                          setIsOpenPlaceABidModal(false)
                          resolve(true)
                        })
                      } else {
                        setIsLoading(false)
                        setIsOpenPlaceABidModal(false)
                        toast.error('Failed to save event detail. Please try again later.')
                        reject()
                      }
                    })
                    .catch(err => {
                      setIsLoading(false)
                      setIsOpenPlaceABidModal(false)
                      toast.error('Failed to save event detail. Please try again later.')
                      console.error(err)
                      reject()
                    })
                } else {
                  setIsLoading(false)
                  setIsOpenPlaceABidModal(false)
                  reject()
                }
              } else {
                const resultApprove = await writeContract(config, {
                  abi: contractApproveABI,
                  address: solavToken,
                  functionName: 'approve',
                  args: [proxyContractAddress, finalPrice],
                })
                const approveTr = await waitForTransactionReceipt(config, { hash: resultApprove })
                if (approveTr.status === 'success') {
                  toast.info('Transaction has been approved for SOLAV')

                  const resultData = await writeContract(config, {
                    abi: contractABI,
                    address: proxyContractAddress,
                    functionName: 'bidding',
                    args: [orderTuple, finalPrice],
                  })

                  const biddTransactionWithSolav = await waitForTransactionReceipt(config, { hash: resultData })

                  if (biddTransactionWithSolav?.status === 'success') {
                    const createBuyNftPayload: OnSaveEventNftQuery = {
                      transaction_hash: resultData,
                      contract_address: proxyContractAddress,
                      network_id: data.network_id,
                    }

                    saveEventNftMutateAsync({
                      ...createBuyNftPayload,
                    })
                      .then(resultData => {
                        if (resultData.status) {
                          getItemDetails({ collectible_id }).then(data => {
                            setData(data.data)
                            setIsLoading(false)
                            setIsOpenPlaceABidModal(false)
                            resolve(true)
                          })
                        } else {
                          setIsOpenPlaceABidModal(false)
                          setIsLoading(false)
                          toast.error('Failed to save event detail. Please try again later.')
                          reject()
                        }
                      })
                      .catch(err => {
                        setIsLoading(false)
                        setIsOpenPlaceABidModal(false)
                        toast.error('Failed to save event detail. Please try again later.')
                        console.error(err)
                        reject()
                      })
                  } else {
                    setIsOpenPlaceABidModal(false)
                    setIsLoading(false)
                    reject()
                  }
                }
              }
            } else {
              setIsOpenPlaceABidModal(false)
              setIsLoading(false)
              reject()
            }
          } else {
            const resultData = await writeContract(config, {
              abi: contractABI,
              address: proxyContractAddress,
              functionName: 'bidding',
              args: [orderTuple, finalPrice],
              value: toBigInt(finalPrice),
            })
            const biddTransaction = await waitForTransactionReceipt(config, { hash: resultData })
            if (biddTransaction?.status === 'success') {
              const createBuyNftPayload: OnSaveEventNftQuery = {
                transaction_hash: resultData,
                contract_address: proxyContractAddress,
                network_id: data.network_id,
              }

              saveEventNftMutateAsync({
                ...createBuyNftPayload,
              })
                .then(resultData => {
                  if (resultData.status) {
                    getItemDetails({ collectible_id }).then(data => {
                      setData(data.data)
                      setIsLoading(false)
                      setIsOpenPlaceABidModal(false)
                      resolve(true)
                    })
                  } else {
                    setIsLoading(false)
                    setIsOpenPlaceABidModal(false)
                    toast.error('Failed to save event detail. Please try again later.')
                    reject()
                  }
                })
                .catch(err => {
                  setIsLoading(false)
                  setIsOpenPlaceABidModal(false)
                  toast.error('Failed to save event detail. Please try again later.')
                  console.error(err)
                  reject()
                })
            } else {
              setIsOpenPlaceABidModal(false)
              setIsLoading(false)
              reject()
            }
          }
        } catch (err) {
          setIsOpenPlaceABidModal(false)
          setIsLoading(false)
          reject()
          console.error(err)
        }
      })()
    })

    toast.promise(promise, {
      pending: "Don't Refresh...Transaction is in Progress ",
      success: 'Success! Your bid on the NFT has been confirmed.',
      error: 'Oops! Failed to bid on the NFT. Please try again later.',
    })
  }

  const handleClaimNFT = async () => {
    if (data.network_id == connectedNetworkId) {
      const promise = new Promise((resolve, reject) => {
        ;(async () => {
          try {
            setIsLoading(true)
            const startingTime = Math.round(new Date(data?.auctionDetails?.startingTime).getTime() / 1000)
            const closingTime = Math.round(new Date(data?.auctionDetails?.initialClosingTime).getTime() / 1000)

            const contractABI = chainId === CHAIN_ID.polygon ? contractPolyABI : contractEthABI
            const proxyContractAddress = data.auctionDetails.contract_address as AddressString

            const buyPrice = data.auctionDetails.startingPrice

            const orderTuple = {
              seller: data.collectible_owner as AddressString,
              contractAddress: data.collection_address,
              royaltyFee: Number(data.royalties) * 100,
              royaltyReceiver: data.ownerObj.wallet_address as AddressString,
              paymentToken: data.auctionDetails.erc20Token,
              basePrice: buyPrice,
              listingTime: startingTime,
              expirationTime: closingTime,
              nonce: Number(data.auctionDetails.nonce),
              tokenId: data.token_id ?? 0,
              supply: 1,
              value: buyPrice,
              nftType: 0,
              orderType: 0,
              signature: data.auctionDetails.signature as AddressString,
              uri: data.ipfs_hash,
              objId: data._id,
            }

            const verifysignature = await readContracts(config, {
              contracts: [
                {
                  address: verifyingContractAddress as AddressString,
                  abi: ABIS.verifySignature as any,
                  functionName: '_verifyOrderSig',
                  args: [orderTuple],
                },
              ],
            })
            if (verifysignature) {
              const resultData = await writeContract(config, {
                abi: contractABI,
                address: proxyContractAddress,
                functionName: 'claim',
                args: [orderTuple],
              })
              const claimTransaction = await waitForTransactionReceipt(config, { hash: resultData })

              if (claimTransaction.status === 'success') {
                const createBuyNftPayload: OnSaveEventNftQuery = {
                  transaction_hash: resultData,
                  contract_address: proxyContractAddress,
                  network_id: data.network_id,
                }

                saveEventNftMutateAsync({
                  ...createBuyNftPayload,
                })
                  .then(resultData => {
                    if (resultData.status) {
                      getItemDetails({ collectible_id }).then(data => {
                        setData(data.data)
                        setIsLoading(false)
                        resolve(true)
                      })
                    } else {
                      setIsLoading(false)
                      reject()
                    }
                  })
                  .catch(err => {
                    console.error(err)
                    setIsLoading(false)
                    toast.error('Failed to save event detail. Please try again later.')
                    reject()
                  })
              } else {
                setIsLoading(false)
                reject()
              }
            }
          } catch (err) {
            console.error(err)
            setIsLoading(false)
            reject()
          }
        })()
      })

      toast.promise(promise, {
        pending: "Don't Refresh...Transaction is in Progress ",
        success: 'Congratulations! You have successfully claimed the NFT.',
        error: 'Oops! Failed to claim the NFT. Please try again later.',
      })
    } else {
      setIsSwitchNetworkModalOpen(true)
    }
  }
  const handleDelistNFT = async () => {
    if (data.network_id == connectedNetworkId) {
      const promise = new Promise((resolve, reject) => {
        ;(async () => {
          try {
            const nftData = data
            setIsLoading(true)

            const startingTime = Math.round(new Date(nftData?.auctionDetails?.startingTime).getTime() / 1000)
            const closingTime = Math.round(new Date(nftData?.auctionDetails?.closingTime).getTime() / 1000)
            const contractABI = chainId === CHAIN_ID.polygon ? contractPolyABI : contractEthABI

            const buyPrice =
              nftData.auctionDetails.auctionType === AUCTION_TYPES.FIXED
                ? nftData.auctionDetails.buyPrice
                : nftData.auctionDetails.startingPrice

            const orderTuple = {
              seller: nftData.collectible_owner as AddressString,
              contractAddress: nftData.collection_address,
              royaltyFee: Number(data.royalties) * 100,
              royaltyReceiver: nftData.ownerObj.wallet_address as AddressString,
              paymentToken: nftData.auctionDetails.erc20Token,
              basePrice: buyPrice,
              listingTime: startingTime,
              expirationTime: closingTime,
              nonce: Number(nftData.auctionDetails.nonce),
              tokenId: nftData.token_id ?? 0,
              supply: 1,
              value: buyPrice,
              nftType: 0,
              orderType: 0,
              signature: nftData.auctionDetails.signature as AddressString,
              uri: nftData.ipfs_hash,
              objId: nftData._id,
            }

            const verifysignature = await readContracts(config, {
              contracts: [
                {
                  address: verifyingContractAddress as AddressString,
                  abi: ABIS.verifySignature as any,
                  functionName: '_verifyOrderSig',
                  args: [orderTuple],
                },
              ],
            })

            if (verifysignature) {
              const resultData = await writeContract(config, {
                abi: contractABI,
                address: nftData.auctionDetails.contract_address as AddressString,
                functionName: 'invalidateSignedOrder',
                args: [orderTuple],
              })

              const delistTransaction = await waitForTransactionReceipt(config, { hash: resultData })
              if (delistTransaction.status === 'success') {
                const createBuyNftPayload: OnSaveEventNftQuery = {
                  transaction_hash: resultData,
                  contract_address: nftData.auctionDetails.contract_address as AddressString,
                  network_id: nftData.network_id,
                }
                saveEventNftMutateAsync({
                  ...createBuyNftPayload,
                })
                  .then(resultData => {
                    if (resultData.status) {
                      getItemDetails({ collectible_id }).then(data => {
                        setData(data.data)
                        setIsLoading(false)
                        resolve(true)
                      })
                    } else {
                      setIsLoading(false)
                      toast.error('Failed to save event detail. Please try again later.')
                      reject()
                    }
                  })
                  .catch(err => {
                    setIsLoading(false)
                    toast.error('Failed to save event detail. Please try again later.')
                    console.error('result data err ', err)
                  })
              } else {
                setIsLoading(false)
                reject()
              }
            }
          } catch (err) {
            setIsLoading(false)
            console.error('result data err ', err)
            reject()
          }
        })()
      })

      toast.promise(promise, {
        pending: "Don't Refresh...Transaction is in Progress ",
        success: 'NFT successfully delisted from sale!',
        error: 'Oops! Failed to delist the NFT. Please try again later.',
      })
    } else {
      setIsSwitchNetworkModalOpen(true)
    }
  }

  const handleLike = () => {
    if (address) {
      likeMutation.mutate(
        { collectible_id: data?._id },
        {
          onSuccess: data => {
            if (data.data.isLike) {
              setLikeCount(prev => prev + 1)
            } else {
              setLikeCount(prev => prev - 1)
            }
          },
        }
      )

      setLike(prev => !prev)
    } else {
      toast.error('Please connect to Metamask')
    }
  }

  useEffect(() => {
    viewCountMutateAsync({
      _id: data._id,
    })
  }, [data, viewCountMutateAsync])

  const renderTimer = useMemo(() => {
    if (saleStatus === ITEM_SALE_STATUS.SOLD) {
      return <span className="font-RobotoCondensed text-xs md:text-paragraph">Sold</span>
    }
    if (saleStatus === ITEM_SALE_STATUS.LISTED || saleStatus === ITEM_SALE_STATUS.FUTURE) {
      if (
        data?.auctionDetails?.auctionType === AUCTION_TYPES.AUCTION &&
        new Date(data?.auctionDetails?.startingTime) > new Date()
      ) {
        return (
          <>
            <div className="block">
              <Timer
                endTime={new Date(data?.auctionDetails.startingTime)}
                size="medium"
                status="pending"
                updateStatus={setSaleStatus}
              />
            </div>
          </>
        )
      } else if (data?.auctionDetails?.auctionType === AUCTION_TYPES.AUCTION && data?.auctionDetails?.closingTime) {
        return (
          <>
            <div className="">
              <Timer endTime={new Date(data?.auctionDetails.closingTime)} size="medium" updateStatus={setSaleStatus} />
            </div>
          </>
        )
      }
    }

    if (saleStatus === ITEM_SALE_STATUS.ENDED && data?.auctionDetails?.closingTime) {
      return <Timer endTime={new Date(data?.auctionDetails.closingTime)} size="medium" status={saleStatus} />
    }
  }, [data?.auctionDetails?.auctionType, data?.auctionDetails?.closingTime, saleStatus])

  useMemo(async () => {
    setSaleStatus(getItemSaleStatus(data))
  }, [data])

  const [isMore, toggleIsMore] = useToggle(false)

  const nftDescription = useMemo(() => {
    if (!data?.description) return ''
    return (
      (isMore || String(data?.description).length <= 300
        ? parse(parseAnchorTags(data?.description))
        : `${data?.description?.slice(0, 300)}...`) ?? ''
    )
  }, [data?.description, isMore])

  return (
    <div className="item-detail-page-wrp grid w-full grid-cols-1 gap-10 font-Urbanist lmd:grid-cols-2">
      <div className="relative h-fit w-full rounded-md bg-white p-4 sm:p-9 xlg:min-h-[564px]">
        <div className="absolute left-12 top-12 z-[8] flex h-[32px] w-[32px] cursor-pointer items-center justify-center  rounded-[50%] bg-white p-1">
          {data.network_id === SOLAV_NETWORKS.ETHEREUM ? (
            <EthereumIcon className="dark:!fill-neutral-100" />
          ) : (
            <PolygonIcon className="dark:!fill-neutral-100" />
          )}
        </div>

        <div className="absolute  right-12 top-12 z-[8] flex h-[32px] w-[32px] cursor-pointer items-center justify-center  rounded-[50%] bg-white p-1">
          <div
            onClick={e => {
              e.preventDefault()
              handleLike()
              e.stopPropagation()
            }}
          >
            {like ? <RedStarIcon /> : <OutlineStarIcon />}
          </div>
        </div>
        <Image
          alt="title"
          height={1000}
          src={data.file || dummyProfileImage}
          styles="h-full w-full rounded-sm object-cover aspect-square"
          width={1000}
        />
      </div>

      <div>
        <div className="flex justify-between">
          <div className="top_tag flex gap-[6px]">
            <Typography className="bg-[linear-gradient(180deg,_#C433FF_18.71%,_#9B00FF_80%)] bg-clip-text text-paragraph font-bold capitalize text-transparent">
              {data.collectible_type}
            </Typography>
            <OutlineCheckIcon />
          </div>
          {data && data?.auctionDetails?.auctionType && data?.auctionDetails?.auctionType === AUCTION_TYPES.AUCTION ? (
            renderTimer
          ) : (
            <></>
          )}
        </div>
        <div className="flex w-full flex-col items-center justify-between sm:flex-row">
          <h1 className="text-[32px] font-bold capitalize leading-title">{data.title}</h1>
          <div className="flex items-center justify-center gap-[18px]">
            <span className="flex items-center justify-center gap-[6px]">
              <EyeIcon /> {data.view_count || 0}
            </span>
            <span className="flex items-center justify-center gap-[6px]">
              <HeartIcon /> {likeCount || 0}
            </span>
          </div>
        </div>
        {/* <Typography className="mb-8 mt-4 text-paragraph font-semibold leading-paragraph tracking-paragraph text-[#989898]">
          {data.description}
        </Typography> */}

        <Typography
          className="mb-8 mt-4 whitespace-pre-wrap text-paragraph font-semibold leading-paragraph tracking-paragraph text-[#989898]"
          size="paragraph"
        >
          {nftDescription}
        </Typography>
        <div
          className={`mt-2 flex items-center gap-4 ${data && data.description?.length < 300 && 'hidden'}`}
          onClick={toggleIsMore}
        >
          <Typography
            className="cursor-pointer text-neutral-400 dark:text-neutral-500"
            size="paragraph"
            variant="condensed"
          >
            Show {!isMore ? 'More' : 'Less'}
          </Typography>
          {!isMore ? (
            <CaretDoubleDownIcon className="stroke-neutral-400 dark:stroke-neutral-500" />
          ) : (
            <CaretDoubleUpIcon className="stroke-neutral-400 dark:stroke-neutral-500" />
          )}
        </div>

        {data.customFields && data.customFields.length ? (
          <Typography className="mb-4 mt-8 smd:text-[20px]" size="heading">
            Properties
          </Typography>
        ) : (
          <></>
        )}
        <div className="flex flex-wrap gap-3">
          {
            // TODO: Add properties
            data.customFields
              ? data.customFields.map((item: any, i: number) => (
                  <Typography
                    className="rounded-lg bg-white px-[28px] py-4 text-paragraph font-semibold capitalize leading-paragraph dark:bg-neutral-200"
                    key={i}
                  >
                    {item.key}: {item.value}
                  </Typography>
                ))
              : ''
          }
        </div>

        <Link href={`/profile/${data.ownerObj.wallet_address}`}>
          <div className="mt-8 flex items-center justify-start gap-2">
            <div className="h-14 w-14 overflow-hidden rounded-full bg-neutral-600">
              {data.ownerObj.image ? (
                <Image alt="user" className="h-full w-full object-cover" src={data.ownerObj.image} />
              ) : (
                ''
              )}
            </div>
            <Typography size="paragraph">
              {data.ownerObj.name ? data.ownerObj.name : formatAddress(data.ownerObj.wallet_address)}
            </Typography>
          </div>
        </Link>

        <div className="mt-8 flex w-full items-end justify-between">
          {data.on_sale || data.last_price ? (
            <div>
              <Typography className="!font-medium text-neutral-500" size="lg">
                {price?.label && price?.label}
              </Typography>
              {price?.label && price?.amount && (
                <PriceCard label={price?.label} price={price?.amount} size="x-large" token={price?.token} />
              )}
            </div>
          ) : (
            <div></div>
          )}

          <div>
            {saleStatus === ITEM_SALE_STATUS.LISTED &&
            data.auctionDetails?.auctionType === AUCTION_TYPES.AUCTION &&
            new Date(data.auctionDetails.closingTime) > new Date() &&
            address &&
            !compareStringsInsentively(data?.collectible_owner, address) &&
            !compareStringsInsentively(data?.auctionDetails?.highestBidder, address) ? (
              <div className="flex w-full flex-row gap-x-2">
                <Button
                  className="w-full"
                  disabled={isLoading}
                  onClick={() => {
                    if (connectedNetworkId === data.network_id) {
                      setIsOpenPlaceABidModal(true)
                    } else {
                      setIsSwitchNetworkModalOpen(true)
                    }
                  }}
                >
                  {isLoading ? (
                    <>
                      <Spinner className="animate-spin" />
                      &nbsp; Loading...
                    </>
                  ) : (
                    'Place A Bid'
                  )}
                </Button>
              </div>
            ) : (
              ''
            )}

            {(!data?.on_sale ||
              (data?.on_sale &&
                compareStringsInsentively(data?.auctionDetails?.highestBidder, NULL_TOKEN_ADDRESS) &&
                data?.auctionDetails?.auctionType === AUCTION_TYPES.AUCTION &&
                new Date(data?.auctionDetails?.closingTime).getTime() < new Date().getTime())) &&
              compareStringsInsentively(data?.collectible_owner, address as AddressString) &&
              data?.is_approve &&
              !data?.is_hide && (
                <Button
                  className="w-full"
                  disabled={isLoading}
                  onClick={() => {
                    if (connectedNetworkId === data.network_id) {
                      setIsOpenPutOnSaleModal(true)
                    } else {
                      setIsSwitchNetworkModalOpen(true)
                    }
                  }}
                >
                  {isLoading ? (
                    <>
                      <Spinner className="animate-spin" />
                      &nbsp; Loading...
                    </>
                  ) : (
                    'Put on Sale'
                  )}
                </Button>
              )}

            {!data?.is_hide &&
              data?.on_sale &&
              address &&
              compareStringsInsentively(data.collectible_owner, address) &&
              (data?.auctionDetails?.auctionType === AUCTION_TYPES.FIXED ||
                (data?.auctionDetails?.auctionType === AUCTION_TYPES.AUCTION &&
                  new Date(data?.auctionDetails?.closingTime).getTime() > new Date().getTime() &&
                  compareStringsInsentively(data?.auctionDetails?.highestBidder, NULL_TOKEN_ADDRESS))) && (
                <Button className="w-full" disabled={isLoading} onClick={handleDelistNFT}>
                  {isLoading ? (
                    <>
                      <Spinner className="animate-spin" />
                      &nbsp; Loading...
                    </>
                  ) : (
                    'Delist'
                  )}
                </Button>
              )}
            {address &&
              (compareStringsInsentively(data?.collectible_owner, address) ||
                compareStringsInsentively(data?.auctionDetails?.highestBidder, address)) &&
              !compareStringsInsentively(data?.auctionDetails?.highestBidder, NULL_TOKEN_ADDRESS) &&
              data?.auctionDetails?.auctionType === AUCTION_TYPES.AUCTION &&
              data?.auctionDetails?.buyer &&
              new Date(data?.auctionDetails?.closingTime).getTime() < new Date().getTime() && (
                <Button className="w-full" disabled={isLoading} onClick={handleClaimNFT}>
                  {isLoading ? (
                    <>
                      <Spinner className="animate-spin" />
                      &nbsp; Loading...
                    </>
                  ) : (
                    'Claim'
                  )}
                </Button>
              )}

            {data.auctionDetails?.auctionType === AUCTION_TYPES.FIXED &&
              address &&
              data.on_sale &&
              !compareStringsInsentively(data?.collectible_owner, address) && (
                <Button className="w-full" disabled={isLoading} onClick={handleBuyNFT}>
                  {isLoading ? (
                    <>
                      <Spinner className="animate-spin" />
                      &nbsp; Loading...
                    </>
                  ) : (
                    'Buy Now'
                  )}
                </Button>
              )}

            <PutOnSaleItemDetailModal
              data={data}
              handleClose={() => setIsOpenPutOnSaleModal(false)}
              open={isOpenPutOnSaleModal}
              selectedToken={selectedToken}
              setData={setData}
              setIsOpenPutOnSaleModal={setIsOpenPutOnSaleModal}
              setSelectedToken={setSelectedToken}
            />

            {data.auctionDetails.erc20Token && (
              <PlaceABid
                currentBid={
                  formatUnits(
                    Number(data.auctionDetails.currentBid) || Number(data.auctionDetails.startingPrice),
                    getTokenKey(data.auctionDetails.erc20Token, data.network_id),
                    true
                  ) as string
                }
                handleBidNFT={handleBidNFT}
                handleClose={() => setIsOpenPlaceABidModal(false)}
                isCurrentBidAvailable={!!Number(data.auctionDetails.currentBid)}
                open={isOpenlaceABidModal}
                isLoading={isLoading}
              />
            )}
            <SwitchNetworkModal
              data={data}
              handleClose={() => setIsSwitchNetworkModalOpen(false)}
              open={isSwitchNetworkModalOpen}
              setIsSwitchNetworkModalOpen={setIsSwitchNetworkModalOpen}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemMainDetailSection
