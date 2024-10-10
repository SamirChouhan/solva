import { classNames } from '@/utils'

export const getStyles = (className: string) => {
  const linkClassName = classNames(
    'hover:text-neutral-400 dark:text-neutral-600 dark:hover:text-neutral-800 transition flex items-center gap-1',
    className
  )

  const disabledClassName = 'select-none cursor-default text-neutral-500 dark:text-neutral-400'

  return [linkClassName, disabledClassName]
}
