import { PriceCardSize } from './PriceCard'

export const getPriceStyles = (size: PriceCardSize) => {
  switch (size) {
    case 'small':
      return ''
    case 'medium':
      return 'text-small font-normal leading-small tracking-small md:text-paragraph md:leading-caption md:tracking-paragraph md:font-medium'
    case 'large':
      return 'text-paragraph font-medium leading-paragraph tracking-paragraph md:text-h4 md:font-bold md:leading-h4 md:tracking-h4'
    default:
      throw 'Wrong PriceCard variant ' + size
  }
}

export const getTokenPriceStyles = (size: PriceCardSize) => {
  switch (size) {
    case 'small':
      return ''
    case 'medium':
      return 'text-small font-normal leading-small tracking-small md:text-caption md:leading-caption md:tracking-paragraph md:font-medium'
    case 'large':
      return 'text-small font-medium leading-paragraph tracking-paragraph md:text-body md:font-medium md:leading-body md:tracking-h4'
    case 'x-large':
      return 'font-Urbanist text-[21px] smd:text-heading leading-[125%] tracking-caption font-bold !text-neutral-100 dark:!text-neutral-900'
    default:
      throw 'Wrong PriceCard variant ' + size
  }
}

export const removeTrailingZeros = (number: number | string) => {
  // Convert the number to a string
  let numStr = number.toString()

  // Remove trailing zeros using regular expression
  numStr = numStr.replace(/\.?0*$/, '')

  // Convert the string back to a number
  return parseFloat(numStr)
}
