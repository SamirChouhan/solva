import { InputVariant } from './interface'

export const getPlaceholderStyles = (variant: InputVariant) => {
  switch (variant) {
    case 'primary':
      return 'placeholder:text-body'
    case 'secondary':
      return 'placeholder:text-md'
    case 'fill':
      return 'placeholder:text-neutral-600 dark:placeholder:text-neutral-500'
  }
}
