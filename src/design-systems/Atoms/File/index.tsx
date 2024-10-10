import Spinner from '../Spinner'
import Video from '../Video'
import Image from '../Image'

import { FileProps } from './interface'

import { isVideoFile } from '@/utils'

const File: React.FC<FileProps> = ({
  alt,
  src,
  type,
  className = '',
  width,
  height,
  isLoading = false,
  styles,
  onCLick = () => false,
}) => {
  const isVideo = isVideoFile(type)

  if (isLoading) {
    return <Spinner />
  }

  if (isVideo) {
    return <Video center className={className} src={src as string} type={type} />
  }

  return (
    <Image alt={alt} className={className} height={height} src={src} styles={styles} width={width} onClick={onCLick} />
  )
}
export default File
