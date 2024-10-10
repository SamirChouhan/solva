import React from 'react'
import NextImage from 'next/image'

import { ImageProps } from './interface'

import { classNames } from '@/utils'
import { useToggle } from '@/hooks'

const Image: React.FC<ImageProps> = ({
  height = 300,
  width = 300,
  alt,
  src,
  className = '',
  styles,
  disabled = false,
  onClick = () => false,
}) => {
  const [isLoading, , , , completeLoading] = useToggle(true)

  return (
    <button
      className={classNames('relative h-full w-full', className)}
      disabled={disabled}
      onClick={() => onClick(src)}
    >
      {isLoading && (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-500 dark:border-neutral-500"></div>
          </div>

          <div className="absolute left-0 top-0 h-full w-full animate-pulse bg-neutral-600 dark:bg-neutral-300"></div>
        </>
      )}
      <NextImage
        alt={alt}
        className={styles}
        draggable="false"
        height={height}
        src={src}
        width={width}
        onLoad={completeLoading}
      />
    </button>
  )
}
export default Image
