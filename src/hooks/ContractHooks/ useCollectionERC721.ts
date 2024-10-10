import { readContracts } from '@wagmi/core'

import ABIS from '@/app/abis'
import { config } from '@/context/wagmiContext/config'

type AbiArgument = string | number | boolean

export const useCollectionERC721 = (functionName: string, args: AbiArgument[]) => {
  const readMethod = async () => {
    const res = await readContracts(config, {
      contracts: [
        {
          address: '0x1dfe7ca09e99d10835bf73044a23b73fc20623df',
          abi: ABIS.collectionERC721 as any,
          functionName: functionName,
          args: args,
          chainId: 8,
        },
        // ...
      ],
    })
    return res
  }

  return { readMethod }
}
