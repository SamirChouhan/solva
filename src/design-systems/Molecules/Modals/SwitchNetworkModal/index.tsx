import React, { useState } from 'react'
import Modal from '@/design-systems/Atoms/Modal'
import Button from '@/design-systems/Atoms/Button'
import Typography from '@/design-systems/Atoms/Typography'
import { ItemDetails } from '@/api-services/interfaces/item-details'
import { CHAIN_ID, SOLAV_NETWORKS } from '@/utils'
import { switchChain } from '@wagmi/core'
import { config } from '@/context/wagmiContext/config'
import { useAccount, useDisconnect, useSignMessage } from 'wagmi'
import { useGetNonce } from '@/hooks/ApiHooks/useGetNonce'
import { useGetSignature } from '@/hooks/ApiHooks/useGetSignature'
import { NonceResponse, SignatureResponse } from '@/api-services/interfaces/auth'
import { SignatureData } from '@/context/UserContext/interface'
import { setCookie, deleteCookie } from 'cookies-next'
import { useUserContext } from '@/context/UserContext'
import Spinner from '@/design-systems/Atoms/Spinner'
import { toast } from 'react-toastify'
interface NetworkSwitchProps {
  handleClose: () => void
  open: boolean
  setIsSwitchNetworkModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  data: ItemDetails
}

const SwitchNetworkModal: React.FC<NetworkSwitchProps> = ({ handleClose, open, setIsSwitchNetworkModalOpen, data }) => {
  const { disconnect } = useDisconnect()
  const { signMessageAsync } = useSignMessage()
  const { address, chainId } = useAccount()
  const { nonceMutateAsync } = useGetNonce()
  const { signatureMutateAsync } = useGetSignature()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { setSignatureData } = useUserContext()

  const handleModalChoiceCallback = async (option: string) => {
    try {
      setIsLoading(true)
      if (option === 'yes') {
        if (data.network_id == SOLAV_NETWORKS.ETHEREUM && chainId === CHAIN_ID.polygon) {
          await switchChain(config, { chainId: CHAIN_ID.etherum })
          await signInWithSelectedNetwork()
        } else if (data.network_id == SOLAV_NETWORKS.POLYGON && chainId === CHAIN_ID.etherum) {
          await switchChain(config, { chainId: CHAIN_ID.polygon })
          await signInWithSelectedNetwork()
          setIsSwitchNetworkModalOpen(false)
        }
      }
      setIsSwitchNetworkModalOpen(false)
      setIsLoading(false)
    } catch (err) {
      toast.error(`User rejected request. Please try again!`)
      setIsSwitchNetworkModalOpen(false)
      setIsLoading(false)
      console.error('error ', err)
    }
  }

  async function signInWithSelectedNetwork() {
    try {
      const nonceReq = {
        wallet_address: String(address),
        network_id: String(chainId),
      }
      const nonceRes: NonceResponse = await nonceMutateAsync(nonceReq)
      if (!nonceRes) {
        throw new Error('Failed to get nonce!')
      }
      const signature = await signMessageAsync({ message: nonceRes.data })

      const signatureReq = {
        nonce: nonceRes.data,
        signature,
        network_id: String(chainId),
        wallet_type: 'METAMASK',
      }
      const signatureRes: SignatureResponse = await signatureMutateAsync(signatureReq)
      if (!signatureRes) {
        throw new Error('Failed to get signatureRes!')
      }
      setCookie('isSignedData', true)
      setCookie('token', signatureRes?.data?.token, {
        expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
      })
      setSignatureData(signatureRes?.data)
    } catch (err) {
      disconnect()
      deleteCookie('token')
      deleteCookie('isSignedData')
      setSignatureData({} as SignatureData)
      toast.error(`User rejected sign request. Reconnect network!`)
      console.error('error ', err)
    }
  }

  return (
    <Modal handleClose={handleClose} label="Switch Network" open={open}>
      <div className="">
        <div className="">
          <Typography className="pb-1 text-left font-Urbanist  text-lg font-bold leading-[145%] text-neutral-100 dark:text-neutral-800">
            {`This is a ${data.network_id === SOLAV_NETWORKS.POLYGON ? 'Polygon' : 'Ethereum'} item. Do you want to switch
            chain?`}
          </Typography>
        </div>
        <div className="flex gap-[12px]">
          {isLoading ? (
            <Button
              className="mt-[51px] w-fit  self-center rounded-lg bg-black text-white"
              loading={isLoading}
              disabled={isLoading}
              onClick={() => handleModalChoiceCallback('yes')}
            >
              <Spinner className="animate-spin" />
              &nbsp; Loading...
            </Button>
          ) : (
            <>
              <Button
                className="mt-[51px] w-fit  self-center rounded-lg bg-black text-white"
                loading={isLoading}
                disabled={isLoading}
                onClick={() => handleModalChoiceCallback('yes')}
              >
                Yes
              </Button>
              <Button
                className="mt-[51px] w-fit  self-center rounded-lg bg-black text-white"
                loading={isLoading}
                disabled={isLoading}
                onClick={() => handleModalChoiceCallback('no')}
              >
                No
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default SwitchNetworkModal
