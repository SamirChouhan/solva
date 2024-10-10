import React from 'react'

import Typography from '../Typography'

import { getPlaceholderStyles } from './utils'
import { InputProps } from './interface'

const Input: React.FC<InputProps> = ({
  className,
  onChange,
  label,
  type,
  value,
  placeholder,
  variant = 'primary',
  name,
  error,
  min,
  inWrpClassName,
  inputClassNames,
  inputStyle,
  onBlur,
  onFocus,
  errorClassName,
  inputDirectWrp,
}) => {
  const labelClass = [
    `text-left font-Urbanist text-lg  font-bold leading-[145%] text-neutral-100 dark:text-neutral-800  pb-[16px] smd:pb-2`,
  ].join(' ')

  const inputClassNamesLocal = [
    'w-full border-none bg-transparent p-[24px] text-base  smd:text-lg  font-medium text-neutral-200 smd:placeholder:text-lg placeholder-text-base dark:text-neutral-500  dark:placeholder-text-neutral-500 outline-none  placeholder:font-medium  placeholder:leading-[148%] placeholder:text-neutral-500 placeholder:text-lg',
    getPlaceholderStyles(variant),
    inputClassNames,
  ].join(' ')

  return (
    <div className={`relative w-full font-Urbanist ${className}`}>
      {label && <Typography className={labelClass}>{label}</Typography>}
      <div
        className={`custom-focus focus-within:border-500 hover:border-500 w-full rounded-sm border  border-solid border-neutral-600 bg-neutral-900 p-0 focus:outline-none   dark:border-neutral-400 dark:bg-transparent   ${inWrpClassName}`}
      >
        <div className={`relative w-full cursor-pointer overflow-hidden rounded-sm ${inputDirectWrp}`}>
          <input
            className={`${inputStyle} ${inputClassNamesLocal}`}
            min={min}
            name={name}
            placeholder={placeholder}
            type={type}
            value={value}
            onBlur={onBlur}
            onChange={onChange}
            onClick={e => e.stopPropagation()}
            onFocus={e => {
              e.stopPropagation()
              onFocus?.()
            }}
          />
        </div>
      </div>
      <p className={`text-error-800 ${errorClassName || ''}`}>{error}</p>
    </div>
  )
}

export default Input
