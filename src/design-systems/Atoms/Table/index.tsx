'use client'

import React from 'react'

import Typography from '../Typography'
import Spinner from '../Spinner'
import { ScrollTrigger } from '../ScrollTrigger'

import { TableProps } from './interface'

function Table<T>({ columns, data, className, isLoading, activePagination, pagination }: TableProps<T>): JSX.Element {
  return (
    <>
      <table className={`w-[1400px] md:w-full ${className}`}>
        <thead>
          <tr>
            {columns.map((column, index) => {
              return (
                <th
                  className="bg-white py-4 text-left dark:bg-neutral-200 [&:nth-child(1)]:ps-[40px]"
                  key={index}
                  style={{ width: column.width, textAlign: column.align }}
                >
                  <Typography
                    className={`text-body font-bold text-neutral-200 dark:text-white ${column.headingClassName}`}
                  >
                    {column.name}
                  </Typography>
                </th>
              )
            })}
          </tr>
        </thead>

        <tbody>
          {data && data.length > 0 ? (
            data.map((item, index) => {
              return (
                <tr className="[&:last-child>td]:border-b-0" key={index}>
                  {columns.map((column, index) => {
                    return (
                      <td
                        className="border-b border-b-[#dedede] py-4 text-left dark:border-b-[#292929] [&:nth-child(1)]:ps-[40px]"
                        key={index}
                        style={{ width: column.width, textAlign: column.align }}
                      >
                        <Typography
                          className={`font-semibold dark:text-[#989898] ${column.itemClassName}`}
                          size="paragraph"
                        >
                          {item ? column?.selector(item) : '-'}
                        </Typography>
                      </td>
                    )
                  })}
                </tr>
              )
            })
          ) : (
            <>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length}>
                    <div className="flex h-full w-full items-center justify-center overflow-hidden py-2">
                      <div className="animate-spin">
                        <Spinner className="h-[36px] w-[36px]" />
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr>
                  {!pagination?.isFetching && (
                    <td colSpan={columns.length}>
                      <Typography className="mt-6 text-center dark:text-[#989898]" size="paragraph">
                        No Records Found
                      </Typography>
                    </td>
                  )}
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>

      {activePagination && (
        <ScrollTrigger
          isLoading={!isLoading && pagination.isFetching}
          onTrigger={() => {
            if (!isLoading && !pagination.isFetchingNextPage && pagination.hasNextPage) {
              pagination.fetchNextPage?.()
            }
          }}
        />
      )}
    </>
  )
}

export default Table
