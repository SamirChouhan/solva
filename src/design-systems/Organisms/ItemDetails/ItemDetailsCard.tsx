import React from 'react'

import { EthereumIcon, PolygonIcon } from '@/design-systems/Atoms/Icons'
import Typography from '@/design-systems/Atoms/Typography'
import { AUCTION_TYPES, formatAddress } from '@/utils'
import { useCopyTextMutation } from '@/hooks/useCopy'
import { ItemDetails } from '@/api-services/interfaces/item-details'

interface ItemDetailsCardProps {
  data: ItemDetails
}

const ItemDetailsCard: React.FC<ItemDetailsCardProps> = ({ data }) => {
  const { mutateAsync: copyAsync } = useCopyTextMutation()
  return (
    <div className="flex items-center justify-start gap-[48px] px-6">
      <table className="w-full border-separate border-spacing-2">
        <tbody>
          <tr>
            <td className="w-[200px]">
              <Typography className="font-semibold" size="paragraph">
                Contract Address
              </Typography>
            </td>
            <td>
              <button onClick={data.collection_address ? () => copyAsync(data.collection_address) : undefined}>
                <Typography
                  className="flex items-center gap-1 font-semibold !text-black dark:!text-white"
                  size="paragraph"
                >
                  {data.collection_address ? (
                    <>
                      {data?.network_id === AUCTION_TYPES.FIXED ? <EthereumIcon /> : <PolygonIcon />}{' '}
                      {formatAddress(data.collection_address)}
                    </>
                  ) : (
                    'N/A'
                  )}
                </Typography>
              </button>
            </td>
          </tr>

          <tr>
            <td className="w-[200px]">
              <Typography className="font-semibold" size="paragraph">
                Token Id
              </Typography>
            </td>

            <td>
              <button className="text-left" onClick={data.token_id ? () => copyAsync(data.token_id) : undefined}>
                <Typography className="font-semibold" size="paragraph">
                  {data.token_id ? data.token_id : 'N/A'}
                </Typography>
              </button>
            </td>
          </tr>

          <tr>
            <td className="w-[200px]">
              <Typography className="font-semibold" size="paragraph">
                Token Standard
              </Typography>
            </td>
            <td>
              <Typography className="font-semibold" size="paragraph">
                {data?.collectionObj?.collectible_type}
              </Typography>
            </td>
          </tr>

          <tr>
            <td className="w-[200px]">
              <Typography className="font-semibold" size="paragraph">
                Chain
              </Typography>
            </td>
            <td>
              <Typography className="font-semibold" size="paragraph">
                {data.network_id === AUCTION_TYPES.AUCTION ? 'Polygon' : 'Ethereum'}
              </Typography>
            </td>
          </tr>

          <tr>
            <td className="w-[200px]">
              <Typography className="font-semibold" size="paragraph">
                Creator Earnings
              </Typography>
            </td>
            <td>
              <Typography className="font-semibold" size="paragraph">
                {data?.royalties}%
              </Typography>
            </td>
          </tr>
          {data?.isShowPromptPublicly && (
            <tr>
              <td className="w-[200px]">
                <Typography className="font-semibold" size="paragraph">
                  Prompt
                </Typography>
              </td>
              <td>
                <Typography className="font-semibold" size="paragraph">
                  {data.generatedImagePrompt}
                </Typography>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ItemDetailsCard
