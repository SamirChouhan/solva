'use client'
import Link from 'next/link'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { usePathname } from 'next/navigation'

import { InputValues } from './interface'

import { FooterLogo, MediumIcon, SendIcon, TelegramIcon, TwitterIcon } from '@/design-systems/Atoms/Icons'
import Typography from '@/design-systems/Atoms/Typography'
import Input from '@/design-systems/Atoms/Input'
import { useEmailSubscribe } from '@/hooks/ApiHooks/useEmailSubscribe'
import { getCurrentYear } from '@/utils'

const ABOUT_US_URL = process.env.NEXT_PUBLIC_ABOUT_US_URL
// Define the TLD test function
const tldTest = function (value: string): boolean {
  const tld = value.split('.').pop()
  return !!tld && ((tld.length <= 3 && (tld === 'com' || tld === 'net')) || tld.length === 2)
}

const max3AfterDotTest = function (value: string): boolean {
  const domainSegments = value.split('@')[1]?.split('.')
  return !!domainSegments && (domainSegments.length <= 2 || (domainSegments[2]?.length ?? 0) <= 3)
}
const Footer: React.FC = () => {
  const commText = ['!font-Inter text-md text-white mb-3 block'].join('')
  const commHead = ['!font-Inter text-[20px] leading-[28px] text-white font-bold pb-6'].join('')
  const pathName = usePathname()
  const { EmailMutateAsync } = useEmailSubscribe()

  const { values, handleChange, handleBlur, handleSubmit, errors } = useFormik<InputValues>({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email')
        .required('Email is required')
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}(?:\.com|\.net)?$/i, 'Invalid email format')
        .test('tld', 'Invalid TLD', tldTest)
        .test('max-3-after-dot', 'Invalid TLD length', max3AfterDotTest),
    }),
    onSubmit: async values => {
      try {
        const response = await EmailMutateAsync(values)
        if (response.status) {
          toast.success('Email sent successfully')
        }
      } catch (error: any) {
        toast.error(error.response.data.message)
      }
    },
  })

  return (
    <footer
      className={`font-inter  bg-[#242424] py-10 text-white  lmd:py-16 ${pathName.includes('select-nft') && 'mb-[131px] smd:mb-0'}`}
    >
      <div className="container mx-auto flex flex-col justify-between slg:flex-row ">
        {/* First Section */}
        <div className="mb-10 flex w-full flex-col gap-y-8  slg:mb-0 slg:w-[200px] xlg:w-[300px] ">
          <FooterLogo />
          <div>
            <Typography className={`!mb-2 ${commText}`}>{`Copyright © ${getCurrentYear()} Solav ltd.`}</Typography>
            <Typography className={`!mb-0 ${commText}`}>All rights reserved</Typography>
          </div>
          <div className="flex space-x-4">
            {/* Replace the links with your actual social media links */}
            <a href={'https://twitter.com/solav_official'} rel="noreferrer" target="_blank">
              <TwitterIcon />
            </a>
            <a href={'https://t.me/solav_official'} rel="noreferrer" target="_blank">
              <TelegramIcon />
            </a>
            <a href={'https://medium.com/@solav.io'} rel="noreferrer" target="_blank">
              <MediumIcon />
            </a>
          </div>
        </div>

        <div className="flex w-full flex-wrap justify-start gap-8 smd:flex-row  smd:flex-nowrap slg:w-[70%] slg:justify-end">
          {/* Second Section */}
          {/* <div className="w-1/2 slg:w-[110px] xlg:w-40">
          <Typography className={commHead}>Products</Typography>

          <Link className={commText} href="#">
            Partnership   
          </Link>
        </div> */}
          {/* Third Section */}
          <div className="w-[35%]  smd:w-full slg:mb-0  ">
            <Typography className={commHead}>Company</Typography>
            <Link className={commText} href={`${ABOUT_US_URL}`} target="_blank">
              About us
            </Link>
            <Link className={commText} href="/terms-and-condition">
              Terms of use
            </Link>
            <Link className={`${commText} !mb-0 smd:!mb-3`} href="#">
              Privacy Policy
            </Link>
          </div>
          {/* Fourth Section */}
          <div className=" smd:w-full slg:mb-0 ">
            <Typography className={commHead}>Support</Typography>
            <Link className={commText} href="#">
              Contact Support
            </Link>
            <Link className={commText} href="#">
              FAQ
            </Link>
          </div>
          {/* Fifth Section */}
          <div className="w-full ">
            <Typography className={commHead}>Stay up to date</Typography>
            <form action="#" className="flex" onSubmit={handleSubmit}>
              <div className="flex w-full items-center rounded-xs bg-[#524e54] slg:w-[190px] xlg:w-[255px]">
                <Input
                  className="rounded-xs border-none !bg-[#524e54]"
                  inWrpClassName="rounded-xs border-none !bg-transparent"
                  inputStyle="rounded-l-xs !bg-[#524e54] px-3 py-2.5 font-Inter !text-white"
                  name="email"
                  placeholder="Your email address"
                  type="email"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <button type="submit">
                  <SendIcon className="mr-[10px] cursor-pointer" />
                </button>
              </div>
            </form>
            {errors.email && <Typography className="mt-1 text-left text-error-800 ">{errors.email}</Typography>}
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer
