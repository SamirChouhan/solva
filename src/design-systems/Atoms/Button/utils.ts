import { ButtonColor, ButtonSize, ButtonVariant } from './interface'

export const getButtonSize = (size: ButtonSize, loading: boolean, fullWidth: boolean) => {
  switch (size) {
    case 'small':
      return `${loading && !fullWidth ? 'w-70 h-30' : ''} px-lg py-sm`
    case 'medium':
      return `${loading && !fullWidth ? 'w-100   ' : ''} p-[16px] smd:px-2xl smd:py-xl `
    case 'large':
      return `${loading && !fullWidth ? 'w-133 h-51' : ''} px-3xl py-lg`
    default:
      throw 'Wrong Button size ' + size
  }
}

export const getButtonBorderStyles = (color: ButtonColor, variant: ButtonVariant) => {
  switch (variant) {
    case 'solid':
      return getSolidButtonBorderStyles(color)
    case 'outlined':
      return getOutlinedButtonBorderStyles(color)
    default:
      throw 'Wrong Button variant ' + variant
  }
}

export const getSolidButtonBorderStyles = (color: ButtonColor) => {
  switch (color) {
    case 'pink':
      return 'active:shadow-solid-brand-active '
    case 'primary':
      return 'active:shadow-solid-light-active dark:active:shadow-solid-dark-active'
    case 'secondary':
      return ''
    case 'green':
      return 'active:shadow-solid-brand-active '
    default:
      throw 'Wrong Solid Button color ' + color
  }
}

export const getOutlinedButtonBorderStyles = (color: ButtonColor) => {
  switch (color) {
    case 'pink':
      return 'shadow-outlined-pink-500 active:shadow-outlined-pink-500 border border-pink-500 '
    case 'primary':
      return 'shadow-outlined-light-default active:shadow-outlined-light-active disabled:shadow-outlined-light-disabled dark:shadow-outlined-dark-default dark:active:shadow-outlined-dark-active dark:disabled:shadow-outlined-dark-disabled'
    case 'secondary':
      return 'border'
    default:
      throw 'Wrong Solid Button color ' + color
  }
}

export const getSpinnerStokeColor = (color: ButtonColor) => {
  switch (color) {
    case 'pink':
      return 'stroke-neutral-100 dark:stroke-neutral-800'
    case 'primary':
      return 'stroke-neutral-800 dark:stroke-neutral-100'
    case 'secondary':
      return 'stroke-neutral-200 dark:stroke-neutral-700'
    default:
      throw 'Wrong Solid Button color ' + color
  }
}

export const getSpinnerSize = (size: ButtonSize) => {
  switch (size) {
    case 'small':
      return 'w-4 h-4'
    case 'medium':
      return 'w-5 h-5'
    case 'large':
      return 'w-8 h-8'
    default:
      throw 'Wrong Button size ' + size
  }
}

export const getButtonColors = (color: ButtonColor, variant: ButtonVariant) => {
  switch (variant) {
    case 'solid':
      return getSolidButtonColors(color)
    case 'outlined':
      return getOutlineButtonColors(color)
    default:
      throw 'Wrong Button variant ' + variant
  }
}

export const getSolidButtonColors = (color: ButtonColor) => {
  switch (color) {
    case 'pink':
      return 'bg-gradient-to-t from-pink-400 from-18.71% to-pink-500 to-80%  enabled:active:bg-brand-hover  disabled:opacity-30 text-white hover:bg-gradient-to-t hover:from-pink-700 hover:from-18.71% hover:to-pink-600 hover:to-80% '
    case 'primary':
      return 'bg-neutral-100 dark:bg-neutral-700 enabled:hover:bg-neutral-400 enabled:active:border-neutral-100 dark:enabled:hover:bg-neutral-600 enabled:active:bg-neutral-400 dark:enabled:active:bg-neutral-600 dark:enabled:active:border-neutral-700 text-neutral-700 dark:text-neutral-100 disabled:opacity-30'
    case 'secondary':
      return 'bg-transparent'
    case 'green':
      return 'bg-gradient-to-t from-green-400 from-18.71% to-green-500 to-80%  enabled:active:bg-brand-hover  disabled:opacity-30 text-white hover:bg-gradient-to-t hover:from-green-700 hover:from-18.71% hover:to-green-600 hover:to-80% '
    default:
      throw 'Wrong Solid Button color ' + color
  }
}

export const getOutlineButtonColors = (color: ButtonColor) => {
  switch (color) {
    case 'pink':
      return 'bg-neutral-900 enabled:hover:bg-gradient-to-t  enabled:hover:from-pink-400 enabled:hover:from-18.71%   enabled:hover:to-pink-500 enabled:hover:to-80%   disabled:opacity-30 text-neutral-200 enabled:hover:text-white dark:bg-neutral-100'
    case 'primary':
      return 'bg-transparent border-pink-500 dark:border-neutral-800  disabled:opacity-30 text-neutral-100 dark:text-neutral-700 '
    case 'secondary':
      return 'bg-transparent border-neutral-500 hover:border-neutral-400 dark:border-neutral-400 dark:hover:border-neutral-500'
    case 'green':
      return 'bg-neutral-900 enabled:hover:bg-gradient-to-t  enabled:hover:from-green-400 enabled:hover:from-18.71%   enabled:hover:to-green-500 enabled:hover:to-80%   disabled:opacity-30 text-neutral-200 enabled:hover:text-white dark:bg-neutral-100'
    default:
      throw 'Wrong Outlined Button color ' + color
  }
}
