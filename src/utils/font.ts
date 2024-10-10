import { Poppins, Urbanist, Allura, Inter } from 'next/font/google'

export const urbanist = Urbanist({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-urbanist',
  display: 'swap',
})

export const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

export const allura = Allura({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-allura',
  display: 'swap',
})

export const inter = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-Inter',
  display: 'swap',
})
