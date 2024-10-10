import React from 'react'

import Typography from '../Typography'

import { TextAreaInputProps } from './interface'

const TextAreaInput: React.FC<TextAreaInputProps> = ({
  label,
  rows,
  placeholder,
  value,
  className,
  error,
  innerClassName,
  ...rest
}) => {
  const textAreaClass = [
    'focus-within:border-1 p-6  focus:outline-none custom-focus w-full   dark:text-neutral-500  resize-none rounded-sm border border-solid border-lightGray   font-Poppins leading-[145%] outline-none border-neutral-600 dark:border-neutral-400 bg-neutral-900 dark:bg-transparent font-Urbanist text-lg  font-medium leading-[145%] text-neutral-200 placeholder:text-neutral-500 ',
  ].join(' ')

  const typographyClass = [
    `text-left font-Urbanist text-lg  font-bold leading-[145%] text-neutral-200 pb-[16px] smd:pb-2 dark:text-neutral-800`,
  ].join(' ')

  return (
    <div className={`relative ${className || ''}`}>
      {label && <Typography className={`${typographyClass} text-black`}>{label}</Typography>}

      <div className={innerClassName}>
        <textarea
          className={textAreaClass}
          name="text"
          placeholder={placeholder}
          rows={rows}
          value={value}
          {...rest}
        ></textarea>
      </div>
      <p className="absolute bottom-[-25px] text-error-800">{error}</p>
    </div>
  )
}

export default TextAreaInput
