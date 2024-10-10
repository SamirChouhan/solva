import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import Modal from '@/design-systems/Atoms/Modal'
import Button from '@/design-systems/Atoms/Button'
import Typography from '@/design-systems/Atoms/Typography'
import Input from '@/design-systems/Atoms/Input'
import Spinner from '@/design-systems/Atoms/Spinner'

interface PlaceABidProps {
  handleClose: () => void
  open: boolean
  handleBidNFT: (offerPrice: string) => Promise<void>
  currentBid: string
  isCurrentBidAvailable: boolean
  isLoading: boolean
}

export const convertDate2UTCTimeStamp = (date: Date) => {
  const utc: number = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes()
  )
  return Math.ceil(utc.valueOf() / 1000)
}

const PlaceABid: React.FC<PlaceABidProps> = ({
  handleClose,
  open,
  currentBid,
  handleBidNFT,
  isCurrentBidAvailable,
  isLoading,
}) => {
  const formik = useFormik({
    initialValues: {
      offerPrice: 0,
    },

    validationSchema: Yup.object({
      offerPrice: Yup.number()
        .required('Offer price is required')
        .test(
          'greater than',
          `Offer price should be ${isCurrentBidAvailable ? 'greater than current bid' : 'greater than or equal to starting bid'} ${currentBid}`,
          function (value) {
            if (isCurrentBidAvailable) {
              return value > Number(currentBid)
            } else {
              return value >= Number(currentBid)
            }
          }
        ),
    }),

    onSubmit: async values => {
      handleBidNFT(values?.offerPrice?.toString())
    },
  })

  return (
    <Modal handleClose={handleClose} label="Place A Bid" open={open}>
      <form onSubmit={formik.handleSubmit}>
        <div className="">
          <div className="mt-4">
            <Typography className="pb-1 text-left font-Urbanist  text-lg font-bold leading-[145%] text-neutral-100 dark:text-neutral-800">
              Offer Price
            </Typography>
            <Input
              className="!w-[100%]"
              error={formik.errors.offerPrice && formik.touched.offerPrice ? formik.errors.offerPrice : ''}
              label=""
              placeholder="Place A Bid"
              type="number"
              {...formik.getFieldProps('offerPrice')}
            />
          </div>
          <Button
            className="mt-[51px] w-fit  self-center rounded-lg bg-black text-white"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <>
                <Spinner className="animate-spin" />
                &nbsp; Loading...
              </>
            ) : (
              'Bid Now'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default PlaceABid
