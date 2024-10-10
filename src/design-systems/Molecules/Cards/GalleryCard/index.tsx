import Card from '../Card'

import { GalleryCardProps } from './interface'

import Typography from '@/design-systems/Atoms/Typography'

const GalleryCard: React.FC<GalleryCardProps> = ({ src, className = '', heading = '', subHeading }) => {
  return (
    <div
      className={`flex h-[328px] w-full  cursor-pointer flex-col rounded-sm border-[#D2D2D2] bg-[#E9E8E8]  p-8 md:h-[336px] xl:w-[332px] ${className}`}
    >
      <div className="knowledge-gallery-card h-[77%] w-full rounded-tl-sm rounded-tr-sm md:h-[80%]">
        <Card
          alt={'name'}
          className="h-full w-full object-contain"
          fileClassName=" h-full w-full !object-contain"
          src={src as string}
        />
      </div>
      <div className="flex h-[23%] w-full max-w-full flex-col items-start justify-start  sm:text-center md:h-[20%]">
        <Typography className="text-gray font-Poppins w-full text-start text-body font-bold leading-paragraph">
          {heading}
        </Typography>
        <Typography
          className="text-gray font-Poppins w-full text-start text-body font-bold leading-paragraph"
          size="heading"
        >
          {subHeading}
        </Typography>
      </div>
    </div>
  )
}
export default GalleryCard
