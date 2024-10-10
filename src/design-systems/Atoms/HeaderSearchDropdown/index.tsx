import Image from 'next/image'
import Link from 'next/link'

import Typography from '../Typography'
import { UnionIcon } from '../Icons'

import { HeaderSearchProps } from './interface'

const HeaderSearchDropdown: React.FC<HeaderSearchProps> = ({ searchResponse }) => {
  if (!searchResponse) return
  return (
    <div className="absolute right-0 top-[90px] z-[99] mt-3 min-h-[100vh] w-full  bg-white px-6 pb-10 pt-[16px] dark:bg-[#212121] md:min-h-[352px] md:pt-16 slg:top-[-10px]  slg:rounded-[28px]">
      {searchResponse?.data ? (
        searchResponse.data.map((item, index: number) => (
          <div className="flex items-center justify-between gap-y-[22px] pt-5" key={index}>
            <div className="flex items-center" key={index}>
              <Image alt="NftImage" className="h-8 w-8 rounded-[4px]" height={32} src={item.previewUrl} width={32} />
              <Typography className="pl-6 text-lg font-medium leading-paragraph tracking-paragraph text-[#282828] dark:text-neutral-500">
                {item.title}
              </Typography>
            </div>
            <Link href={`/nft/${item?.id}`}>
              <UnionIcon height={18} width={18} />
            </Link>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center gap-y-[22px] pt-5">
          <Typography>Data Not Found</Typography>
        </div>
      )}
    </div>
  )
}
export default HeaderSearchDropdown
