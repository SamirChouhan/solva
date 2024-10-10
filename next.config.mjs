/** @type {import('next').NextConfig} */
import createMDX from '@next/mdx'

const nextConfig = {
  images: {
    domains: ['solav.s3.amazonaws.com','solav-prod.s3.amazonaws.com', 'ipfs.io', 'd3li1zrnpbwv0v.cloudfront.net', 'd286z1jdp6gix8.cloudfront.net','d15i1rxaf6ac34.cloudfront.net', 'i.pravatar.cc'],
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
