import React, { useMemo } from 'react'
import Link from 'next/link'

import Typography from '@/design-systems/Atoms/Typography'
import { useExampleNft } from '@/hooks/ApiHooks/useExampleNFT'
import Button from '@/design-systems/Atoms/Button'
import NftCard from '@/design-systems/Molecules/Cards/NftCard'
import NftCardSkeleton from '@/design-systems/Molecules/Skeletons/NftCardSkeleton'

const PromptExamples = () => {
  const { exampleNftData, isLoadingExampleNft } = useExampleNft()

  const getCard = useMemo(() => {
    if (isLoadingExampleNft) {
      return Array(3)
        .fill('')
        .map((_, idx) => {
          return (
            <div
              className="h-[340px] w-[100%]    smd:w-[100%] md:w-[60.5%] lmd:w-[46.5%] lg:w-[46.5%] xlg:w-[100%] "
              key={idx}
            >
              <NftCardSkeleton variant="example" />
            </div>
          )
        })
    } else {
      return exampleNftData?.map((item, idx) => {
        return (
          <div className="w-[100%]   smd:w-[100%] md:w-[60.5%] lmd:w-[46.5%] lg:w-[46.5%] xlg:w-[100%] " key={idx}>
            <NftCard
              heading={item.prompt}
              src={item.imageUrl}
              isLink={false}
              // subHeading={exampleNft[0].subHeading}
              variant="example"
            />
          </div>
        )
      })
    }
  }, [exampleNftData, isLoadingExampleNft])

  return (
    <div className="container mx-auto">
      <Typography className="text-center dark:text-pink-500 smd:text-neutral-100" size="title">
        Prompt Examples
      </Typography>

      <div className="mb-14 mt-10 flex flex-wrap items-center  justify-center gap-6 xlg:flex-nowrap">{getCard}</div>

      <Button className="mx-auto my-0 w-full rounded-xl bg-black text-white smd:mt-5 smd:w-fit">
        <Link href={'/explore'}>Explore now</Link>
      </Button>
    </div>
  )
}

export default PromptExamples
