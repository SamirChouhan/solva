import { useEffect } from 'react'

import { CheckIcon } from '../Icons'
import Typography from '../Typography'

import { CheckboxProps } from './interface'
import { getBackgroundStyles } from './utils'

import { useToggle } from '@/hooks'

export const Checkbox: React.FC<CheckboxProps> = ({
  className = '',
  label = '',
  checked = false,
  disabled = false,
  onChange,
}) => {
  const [state, toggle, turn] = useToggle(checked)
  const classNames = [
    className,
    'group',
    'flex items-center gap-lg',
    disabled ? 'text-neutral-500' : 'cursor-pointer',
  ].join(' ')

  useEffect(() => {
    turn(checked)
  }, [checked, turn])

  const checkIconClassNames = {
    fill: getBackgroundStyles(disabled, state),
  }

  const handleChange = (state: boolean, label: string) => {
    onChange?.(!state, label)
    toggle()
  }

  return (
    <div className={classNames} onClick={() => handleChange(state, label)}>
      <CheckIcon className="h-4 min-h-4 w-4 min-w-4" {...checkIconClassNames} />
      <Typography size="bold-paragraph" variant="condensed">
        {label}
      </Typography>
    </div>
  )
}
