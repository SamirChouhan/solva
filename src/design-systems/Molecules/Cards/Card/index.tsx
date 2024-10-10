import Link from 'next/link'

import { CardProps } from './interface'
import { getBorderRadius, getTransform } from './utils'

import { getExtentionOfImage } from '@/utils'
import File from '@/design-systems/Atoms/File'

const Card: React.FC<CardProps> = ({
  alt,
  children,
  className,
  fileClassName = 'h-[256px]',
  src,
  variant = 'all',
  notification,
  direction,
  onClick,
  // href = '',
}) => {
  const borderRadius = getBorderRadius(variant)
  const cardDirection = getTransform(direction)
  const type = getExtentionOfImage(src as string) as string
  return (
    <div
      className={`${
        direction != 'z-direction' && cardDirection
      } relative rounded-sm  ${className}  flex flex-col ${borderRadius} opacity-100`}
    >
      {/* <Link className="flex h-full w-full flex-col" draggable="false" href={href} scroll={false}> */}
      <div className={`flex h-full w-full  ${borderRadius}`}>
        <File
          alt={alt}
          className={`${borderRadius} overflow-hidden`}
          src={src}
          styles={`${fileClassName} h-full w-full ${borderRadius} ${
            direction === 'z-direction' && cardDirection
          } object-cover`}
          type={type}
          onCLick={onClick}
        />
      </div>
      {notification}
      {children}
      {/* </Link> */}
    </div>
  )
}
export default Card
