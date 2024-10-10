export const VIDEO_CONTENT_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/ogg',
  'video/avi',
  'video/wmv',
  'video/mov',
  'video/mpg',
  'video/mpeg',
  'video/rm',
  'video/ram',
  'video/swf',
  'video/flv',
  'mp4',
  'quicktime',
  'webm',
  'ogg',
  'avi',
  'wmv',
  'mov',
  'mpg',
  'mpeg',
  'rm',
  'ram',
  'swf',
  'flv',
]

export const validImageTypes = ['image/jpeg', 'image/png']

export const isVideoFile = (contentType: string): boolean => {
  return VIDEO_CONTENT_TYPES.includes(contentType?.toLowerCase() ?? '')
}
