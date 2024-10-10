import { TypographyVariant, TypographyRobotCondensedSize, TypographyRobotSize } from './interface'

export const getFontFamily = (variant: TypographyVariant) => {
  switch (variant) {
    case 'regular':
      return 'font-Urbanist'
    case 'condensed':
      return 'font-Poppins'
    default:
      throw 'Wrong Typography variant ' + variant
  }
}

export const getFontSize = (size: TypographyRobotCondensedSize | TypographyRobotSize) => {
  switch (size) {
    /**
     * font-size: 64px
     * line-height: 90%
     * letter-spacing: -0.8px
     * font-weight: bold
     */
    case 'h1':
      return 'text-h1 leading-h1 tracking-h1 font-bold'

    /**
     * font-size: 48px
     * line-height: 90%
     * letter-spacing: -0.5px
     * font-weight: bold
     */
    case 'h2':
      return 'text-h3 tracking-h3 md:text-h2 leading-[125%] md:tracking-h2 font-bold '

    /**
     * font-size: 38px
     * line-height: 90%
     * letter-spacing: -0.5px
     * font-weight: bold
     */
    case 'h3':
      return 'md:text-h3 md:leading-h3 md:tracking-h3 font-bold text-h4 leading-h4 tracking-h4'

    /**
     * font-size: 28px
     * line-height: 90%
     * letter-spacing: -0.5px
     * font-weight: bold
     */
    case 'h4':
      return 'md:text-h4 md:leading-h4 md:tracking-h4 font-bold text-h5 leading-h5 tracking-h5'
    /**
     * font-size: 32px
     * line-height: 125%
     * letter-spacing: 0.32px
     * font-weight: 700
     */
    case 'title':
      return 'text-h4 smd:text-title leading-title tracking-title font-bold'

    /**
     * font-size: 36px
     * line-height: 120%
     * letter-spacing: -0.2px
     * font-weight: 400
     */
    case 'subtitle':
      return 'text-subtitle leading-subtitle tracking-subtitle font-bold'

    /**
     * font-size: 18px
     * line-height: 148%
     * letter-spacing: 0.18px
     * font-weight: 500
     */
    case 'paragraph':
      return 'text-[16px] smd:text-paragraph leading-paragraph tracking-paragraph font-medium dark:text--neutral-100 text-neutral-1000'

    /**
     * font-size: 18px
     * line-height: 148%
     * letter-spacing: 0.18px
     * font-weight: 600
     */
    case 'bold-paragraph':
      return 'text-[16px] smd:text-lg leading-[148%] tracking-[0.18px] font-semibold'

    /**
     * font-size: 24px
     * line-height: 125%
     * letter-spacing: 0.24px
     * font-weight: 700
     */
    case 'heading':
      return 'text-[21px] smd:text-heading leading-[125%] tracking-caption font-bold'

    /**
     * font-size: 16px
     * line-height: 150%
     * letter-spacing: 0.16px
     * font-weight: 500
     */
    case 'small':
      return 'text-small leading-sm tracking-paragraph font-normal'

    /**
     * font-size: 12px
     * line-height: 150%
     * letter-spacing: 0px
     * font-weight: 400
     */
    case 'sm':
      return 'text-sm leading-sm tracking-sm font-normal'

    /**
     * font-size: 14px
     * line-height: 150%
     * letter-spacing: 0px
     * font-weight: 400
     */
    case 'md':
      return 'text-md leading-md tracking-md font-normal'

    /**
     * font-size: 18px
     * line-height: 150%
     * letter-spacing: 0px
     * font-weight: 400
     */
    case 'lg':
      return 'text-lg leading-lg tracking-lg font-normal'
    /**
     * font-size: 18px
     * line-height: 100%
     * letter-spacing: 0.18px;
     * font-weight: 800
     */
    case 'button':
      return 'text-[16px] smd:text-lg leading-[100%] tracking-[0.18px] font-extrabold font-Urbanist'
    default:
      throw 'Wrong Typography size ' + size
  }
}
