import { CHAIN_IDS, NETWORK_ID } from './web3'
import { IS_PRODUCTION, SOLAV_NETWORKS } from './Constant'

export const SOLAV_TOKEN_ADDRESS_NEW = {
  [NETWORK_ID.ethereum]: IS_PRODUCTION
    ? '0xfc5e4ed56153b57aa8ef769eba3e79e58e19be93'
    : '0x1a5afc621b9e933ef626b176d4125e45bee0380b',
  [NETWORK_ID.polygon]: IS_PRODUCTION
    ? '0x31e8cac60330fc9283d8876732c45176f5fb0da1'
    : '0xbbbb450e756bb5918d418913197d6ab4014d62dd',
}

export const getSolavTokenAddress = (networkId: string) => {
  switch (networkId) {
    case NETWORK_ID.ethereum:
      return SOLAV_TOKEN_ADDRESS_NEW[NETWORK_ID.ethereum]
    case NETWORK_ID.polygon:
      return SOLAV_TOKEN_ADDRESS_NEW[NETWORK_ID.polygon]
    default:
      return ''
  }
}

export const marketplaceValidatorContractAddress = (chainId: number | undefined) => {
  switch (chainId) {
    case CHAIN_IDS.sepolia:
      return '0xb4c582b8d1b20fef4d4bd8e96851afbe8f88edc6'
    case CHAIN_IDS.polygonAmoy:
      return '0xb4c582b8d1b20fef4d4bd8e96851afbe8f88edc6'
    case CHAIN_IDS.mainnet:
      return '0x70160760482936fabe14932deb00f0e26974bc80'
    case CHAIN_IDS.polygon:
      return '0x70160760482936fabe14932deb00f0e26974bc80'
    default:
      return ''
  }
}

export const getMarketplaceContractAddress = (chainId: number | undefined) => {
  switch (chainId) {
    case CHAIN_IDS.sepolia:
      return '0xfe90908194b03a0b5e3ec45965bb3cb5ef9959a9'
    case CHAIN_IDS.polygonAmoy:
      return '0xfe90908194b03a0b5e3ec45965bb3cb5ef9959a9'
    case CHAIN_IDS.mainnet:
      return '0x9804e119000f5f3515034f236a234a702be29ed3'
    case CHAIN_IDS.polygon:
      return '0x9804e119000f5f3515034f236a234a702be29ed3'
    default:
      return ''
  }
}

export const getMarketplaceTradeContractAddress = (chainId: number | undefined) => {
  switch (chainId) {
    case CHAIN_IDS.sepolia:
      return '0x9831cfd5688f8b80dc6f62c58fb34998523e1d9f'
    case CHAIN_IDS.polygonAmoy:
      return '0x9831cfd5688f8b80dc6f62c58fb34998523e1d9f'
    case CHAIN_IDS.mainnet:
      return '0xc3ce68cec39186f5f1ff84526f30a2fec2c08f69'
    case CHAIN_IDS.polygon:
      return '0xc3ce68cec39186f5f1ff84526f30a2fec2c08f69'
    default:
      return ''
  }
}

export const getCustomCollectionContractAddress = (chainId: number | undefined) => {
  switch (chainId) {
    case CHAIN_IDS.sepolia:
      return '0x44e8b084b5E3EBb00c1246501482516bb7633107'
    case CHAIN_IDS.polygonAmoy:
      return '0x1A5afC621B9E933EF626B176d4125E45BEE0380B'
    case CHAIN_IDS.mainnet:
      return '0x02521EBAe51A51DdB79b9Da676050CEb62324DF7'
    case CHAIN_IDS.polygon:
      return '0x02521EBAe51A51DdB79b9Da676050CEb62324DF7'
    default:
      return ''
  }
}

export const getSolavTokenContractAddress = (chainId: number | undefined) => {
  switch (chainId) {
    case CHAIN_IDS.sepolia:
      return '0x1a5afc621b9e933ef626b176d4125e45bee0380b'
    case CHAIN_IDS.polygonAmoy:
      return '0xbbbb450e756bb5918d418913197d6ab4014d62dd'
    case CHAIN_IDS.mainnet:
      return '0xfc5e4ed56153b57aa8ef769eba3e79e58e19be93'
    case CHAIN_IDS.polygon:
      return '0x31e8cac60330fc9283d8876732c45176f5fb0da1'
    default:
      return ''
  }
}

export const getDefaultContractAddress = (chainId: number | undefined) => {
  switch (chainId) {
    case CHAIN_IDS.sepolia:
      return '0xbbbb450e756bb5918d418913197d6ab4014d62dd'
    case CHAIN_IDS.polygonAmoy:
      return '0x491d9eba4ca25c3260c9d4bbea5483aca2962c7b'
    case CHAIN_IDS.mainnet:
      return '0x02521ebae51a51ddb79b9da676050ceb62324df7'
    case CHAIN_IDS.polygon:
      return '0x02521ebae51a51ddb79b9da676050ceb62324df7'
    default:
      return ''
  }
}

export const getCollectionFactoryContractAddress = (chainId: number | undefined) => {
  switch (chainId) {
    case CHAIN_IDS.sepolia:
      return '0x44e8b084b5e3ebb00c1246501482516bb7633107'
    case CHAIN_IDS.polygonAmoy:
      return '0x1a5afc621b9e933ef626b176d4125e45bee0380b'
    case CHAIN_IDS.mainnet:
      return ''
    case CHAIN_IDS.polygon:
      return ''
    default:
      return ''
  }
}

export const getSubscriptionContractAddress = (chainId: number | undefined) => {
  switch (chainId) {
    case CHAIN_IDS.sepolia:
      return '0x35849fd80805d76edb9094dcdddf8befdb63ac19'
    case CHAIN_IDS.polygonAmoy:
      return '0xde36f8b6e0a242635dd6e0dc2d1eda95c8cac4d7'
    case CHAIN_IDS.mainnet:
      return '0x42cb00b86f0e7c53204d2536bdbfa2af994d8ce2'
    case CHAIN_IDS.polygon:
      return '0x9c58157c18c50e27b78d3c543a5bed023c5792e1'
    default:
      return ''
  }
}

export const getNetworkIdByChainId = (chainId: number | undefined) => {
  switch (chainId) {
    case CHAIN_IDS.sepolia:
      return SOLAV_NETWORKS.ETHEREUM
    case CHAIN_IDS.polygonAmoy:
      return SOLAV_NETWORKS.POLYGON
    default:
      return ''
  }
}
