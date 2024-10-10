import { IS_PRODUCTION } from '@/utils'
import { Transport } from 'viem'
import { cookieStorage, createConfig, createStorage, http } from 'wagmi'
import { Chain, mainnet, polygon, polygonAmoy, sepolia } from 'wagmi/chains'
import { walletConnect } from 'wagmi/connectors'
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
}

let chains: [Chain, ...Chain[]]
let transports: { [key: string]: Transport }

if (IS_PRODUCTION) {
  chains = [mainnet, polygon]
  transports = {
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/2jOMlg80-XO3avr7RFKZ4OyWNUsl_h8H`),
    [polygon.id]: http(`https://polygon-mainnet.g.alchemy.com/v2/i8zNz3ZVVvUIXvd_Pe2a4an5Dt4TzSrn`),
  }
} else {
  chains = [sepolia, polygonAmoy]
  transports = {
    [sepolia.id]: http(),
    [polygonAmoy.id]: http(),
  }
}

// Create wagmiConfig
export const config = createConfig({
  chains,
  transports,
  connectors: [walletConnect({ projectId, metadata, showQrModal: false })],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
})
