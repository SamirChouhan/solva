export interface MobileHeaderProps {
  isOpen?: boolean
  isSignedMessage: boolean
  OpenWallet: () => void
  isConnecting: boolean
  openCheck: {
    open: boolean
    selectedNetworkId?: `${string}:${string}` | undefined
  }
}
