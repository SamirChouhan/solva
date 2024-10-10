'use client'
import React, { useState } from 'react'
import moment from 'moment'
import Image from 'next/image'
import Typography from '@/design-systems/Atoms/Typography'
import { convertWeiToEther, formatAddress } from '@/utils'
import Table from '@/design-systems/Atoms/Table'
import { useUserContext } from '@/context/UserContext'
import useUserPlanHistory from '@/hooks/ApiHooks/useUserPlanHistory'
import { useCopyTextMutation } from '@/hooks/useCopy'

const history = [
  { label: 'Credits Purchase History', key: 'credit' },
  { label: 'Transaction History', key: 'transaction' },
]

const PurchaseHistoryTable: React.FC = () => {
  const { signatureData } = useUserContext()
  const [historyType, setHistoryType] = useState<string>('credit')

  const data = useUserPlanHistory(signatureData.user?.id, historyType, 1, 10)
  const { mutateAsync: copyAsync } = useCopyTextMutation()

  return (
    <div className="mb-16 mt-8">
      <div className="relative overflow-hidden rounded-md border-[3px] border-white pb-[32px] pt-[40px] dark:border-neutral-200">
        <div className="absolute inset-0 backdrop-blur-[42px]"></div>
        <div className="relative z-[2]">
          <div className="mb-8 ml-4 inline-block gap-2 rounded-full bg-[#F0F0F0] dark:bg-[#232323]">
            {history.map(({ label, key }) => (
              <button key={key} onClick={() => setHistoryType(key)}>
                <Typography
                  className={`from-18.71% enabled:active:bg-brand-hover cursor-pointer rounded-full from-pink-400 to-pink-500 to-80% px-4 py-2 !font-semibold hover:bg-gradient-to-t hover:text-white disabled:opacity-30 ${key === historyType ? 'bg-gradient-to-t text-white' : ''}`}
                  size="paragraph"
                >
                  {label}
                </Typography>
              </button>
            ))}
          </div>

          {historyType === 'credit' ? (
            <div className="overflow-x-auto">
              <Table
                activePagination={true}
                columns={[
                  {
                    name: 'Id',
                    selector: item => (
                      <div
                        className="flex cursor-pointer items-center gap-1"
                        onClick={() => {
                          item?.currency === 'solav'
                            ? copyAsync(item?.chainTransactionHash)
                            : copyAsync(item?.paymentInitiateId)
                        }}
                      >
                        <svg fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M13.3341 9.33345C13.591 9.33358 13.8379 9.4325 14.0237 9.60972C14.2096 9.78695 14.3201 10.0289 14.3325 10.2854C14.3448 10.5419 14.258 10.7933 14.09 10.9876C13.922 11.1818 13.6858 11.304 13.4301 11.3288L13.3341 11.3335H5.08147L6.04147 12.2935C6.22332 12.4746 6.32852 12.7188 6.3353 12.9754C6.34207 13.2321 6.24991 13.4814 6.07788 13.672C5.90585 13.8625 5.66714 13.9796 5.41116 13.999C5.15519 14.0184 4.90157 13.9386 4.70281 13.7761L4.62681 13.7075L2.07414 11.1541C1.42481 10.5048 1.84747 9.40945 2.73481 9.33745L2.82814 9.33345H13.3341ZM9.96081 2.29345C10.1357 2.11838 10.3693 2.01439 10.6165 2.00158C10.8636 1.98878 11.1067 2.06807 11.2988 2.22412L11.3748 2.29279L13.9275 4.84612C14.5768 5.49545 14.1541 6.59079 13.2668 6.66279L13.1735 6.66679H2.66747C2.41066 6.66666 2.16374 6.56774 1.97788 6.39051C1.79202 6.21329 1.68147 5.97136 1.66913 5.71484C1.65678 5.45833 1.7436 5.2069 1.91159 5.01265C2.07958 4.81841 2.31586 4.69623 2.57147 4.67145L2.66747 4.66679H10.9201L9.96014 3.70679C9.77287 3.51929 9.66769 3.26512 9.66769 3.00012C9.66769 2.73512 9.77354 2.48095 9.96081 2.29345Z"
                            fill="#989898"
                          />
                        </svg>

                        {item?.currency === 'solav'
                          ? formatAddress(item?.chainTransactionHash)
                          : formatAddress(item?.paymentInitiateId)}
                      </div>
                    ),

                    width: '20%',
                  },
                  {
                    name: 'Type',
                    selector: item => <span className="uppercase">{item.currency}</span>,
                    width: '15%',
                  },
                  {
                    name: 'Price',
                    selector: item => (
                      <>
                        {item.price.numberDecimal} {item?.currency === 'solav' ? 'SOL' : 'USD'}
                      </>
                    ),
                    width: '10%',
                  },
                  {
                    name: 'Plan Name',
                    selector: item => <div className="capitalize">{item.planId.planName}</div>,
                  },
                  {
                    name: 'Bundle Size',
                    selector: item => <>{item.planId.bundleSize}</>,
                  },
                  {
                    name: 'Created',
                    selector: item => <>{moment(item.createdOn).format('DD MMM YYYY')}</>,
                    width: '20%',
                  },
                ]}
                data={data.data || []}
                isLoading={data.isLoading}
                pagination={{
                  isFetchingNextPage: data.isFetchingNextPage,
                  fetchNextPage: data.fetchNextPage,
                  hasNextPage: data.hasNextPage,
                  isFetching: data.isFetching,
                }}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table
                activePagination={true}
                className="!w-[980px] font-semibold xlg:!w-full"
                columns={[
                  {
                    name: 'Event',
                    selector: item => <>{item.event}</>,
                    width: '10%',
                  },
                  {
                    name: 'Item',
                    selector: item => (
                      <div className="flex gap-3 ">
                        <Image alt="" height={32} src={item.imageUrl ? item.imageUrl : ''} width={32} />
                        <Typography className="max-w-[200px] truncate">{item.item}</Typography>
                      </div>
                    ),
                    width: '23%',
                  },
                  {
                    name: 'Unit Price',
                    selector: item => (
                      <span className="uppercase">{item.amount ? convertWeiToEther(item.amount) : 'N/A'}</span>
                    ),
                    width: '12%',
                  },
                  {
                    name: 'Quantity',
                    selector: item => <span className="uppercase">{item.quantity}</span>,
                    width: '10%',
                  },
                  {
                    name: 'from',
                    selector: item => <span className="uppercase">{item.from ? formatAddress(item.from) : 'N/A'}</span>,
                    width: '16%',
                  },
                  {
                    name: 'to',
                    selector: item => <span className="uppercase">{item.to ? formatAddress(item.to) : 'N/A'}</span>,
                    width: '16%',
                  },
                  {
                    name: 'Date',
                    selector: item => <span className="uppercase">{moment(item.date).format('DD MMM YYYY')} </span>,
                    width: '12%',
                  },
                ]}
                data={data.data || []}
                isLoading={data.isLoading}
                pagination={{
                  isFetchingNextPage: data.isFetchingNextPage,
                  fetchNextPage: data.fetchNextPage,
                  hasNextPage: data.hasNextPage,
                  isFetching: data.isFetching,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PurchaseHistoryTable
