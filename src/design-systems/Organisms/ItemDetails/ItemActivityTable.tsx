'use client'

import React from 'react'
import moment from 'moment'

import Table from '@/design-systems/Atoms/Table'
import { formatAddress, formatUnits, getFromAddress, getToAddress, getTokenKey } from '@/utils'
import { useCopyTextMutation } from '@/hooks/useCopy'
import { ItemActivityResponse } from '@/api-services/interfaces/item-details'
import Typography from '@/design-systems/Atoms/Typography'

interface ItemActivityTableProps {
  data: ItemActivityResponse
}

const ItemActivityTable: React.FC<ItemActivityTableProps> = ({ data }) => {
  const { mutateAsync: copyAsync } = useCopyTextMutation()
  return (
    <div className="overflow-x-auto">
      <Table
        activePagination={false}
        columns={[
          {
            name: 'Event',
            selector: item =>
              item.type ? (
                <div className="flex items-center gap-1">
                  <svg fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M13.3341 9.33345C13.591 9.33358 13.8379 9.4325 14.0237 9.60972C14.2096 9.78695 14.3201 10.0289 14.3325 10.2854C14.3448 10.5419 14.258 10.7933 14.09 10.9876C13.922 11.1818 13.6858 11.304 13.4301 11.3288L13.3341 11.3335H5.08147L6.04147 12.2935C6.22332 12.4746 6.32852 12.7188 6.3353 12.9754C6.34207 13.2321 6.24991 13.4814 6.07788 13.672C5.90585 13.8625 5.66714 13.9796 5.41116 13.999C5.15519 14.0184 4.90157 13.9386 4.70281 13.7761L4.62681 13.7075L2.07414 11.1541C1.42481 10.5048 1.84747 9.40945 2.73481 9.33745L2.82814 9.33345H13.3341ZM9.96081 2.29345C10.1357 2.11838 10.3693 2.01439 10.6165 2.00158C10.8636 1.98878 11.1067 2.06807 11.2988 2.22412L11.3748 2.29279L13.9275 4.84612C14.5768 5.49545 14.1541 6.59079 13.2668 6.66279L13.1735 6.66679H2.66747C2.41066 6.66666 2.16374 6.56774 1.97788 6.39051C1.79202 6.21329 1.68147 5.97136 1.66913 5.71484C1.65678 5.45833 1.7436 5.2069 1.91159 5.01265C2.07958 4.81841 2.31586 4.69623 2.57147 4.67145L2.66747 4.66679H10.9201L9.96014 3.70679C9.77287 3.51929 9.66769 3.26512 9.66769 3.00012C9.66769 2.73512 9.77354 2.48095 9.96081 2.29345Z"
                      fill="#989898"
                    />
                  </svg>
                  {item.type}
                </div>
              ) : (
                '-'
              ),
            width: '20%',
          },

          {
            name: 'Price',
            selector: item => (
              <>
                {item.amount ? (
                  <>
                    <Typography variant="condensed">
                      {`${formatUnits(item.amount, getTokenKey(item.ERC20Address, item.network_id), true)} ${getTokenKey(item.ERC20Address, item.network_id)}`}
                    </Typography>
                  </>
                ) : (
                  '-'
                )}
              </>
            ),
            width: '20%',
          },

          {
            name: 'From',
            selector: item =>
              getFromAddress(item) ? (
                <button onClick={() => copyAsync(getFromAddress(item))}>{formatAddress(getFromAddress(item))}</button>
              ) : (
                '-'
              ),
            width: '25%',
          },

          {
            name: 'To',
            selector: item =>
              getToAddress(item) ? (
                <button onClick={() => copyAsync(getToAddress(item))}>{formatAddress(getToAddress(item))}</button>
              ) : (
                '-'
              ),
            width: '25%',
          },

          {
            name: 'Time',
            selector: item => <>{item.time ? moment(new Date(item.time)).fromNow() : '-'}</>,
            width: '10%',
            align: 'left',
          },
        ]}
        data={data.data || []}
      />
    </div>
  )
}

export default ItemActivityTable
