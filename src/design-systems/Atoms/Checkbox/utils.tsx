export const getBorderStyles = (disabled = false, checked = false) => {
  if (disabled) {
    return 'stroke-neutral-500 dark:stroke-neutral-400'
  }
  if (checked) {
    return 'stroke-neutral-100 group-hover:stroke-neutral-400 dark:stroke-neutral-800 dark:group-hover:stroke-neutral-800'
  } else {
    return 'stroke-neutral-500 group-hover:stroke-neutral-100 dark:stroke-neutral-400 dark:group-hover:stroke-neutral-500'
  }
}

export const getCheckStyles = (disabled = false, checked = false) => {
  if (!disabled && checked) {
    return 'fill-neutral-800 dark:fill-neutral-100'
  } else {
    return 'fill-transparent'
  }
}

export const getBackgroundStyles = (disabled = false, checked = false) => {
  if (disabled) {
    return 'fill-transparent dark:fill-neutral-400'
  }
  if (checked) {
    return 'fill-neutral-100 dark:fill-neutral-500 group-hover:fill-neutral-400 dark:group-hover:fill-neutral-400'
  } else {
    return 'fill-transparent dark:fill-neutral-800 dark:group-hover:fill-neutral-500'
  }
}
