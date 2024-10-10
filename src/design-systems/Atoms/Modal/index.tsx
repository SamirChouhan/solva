import React, { useEffect } from 'react'

import Typography from '../Typography'
import { CrossIcon } from '../Icons'

import { ModalCreateProps } from './interface'

import { brandGradient } from '@/utils'

const Modal: React.FC<ModalCreateProps> = ({
  children,
  open,
  handleClose,
  label,
  description,
  overLayClassName,
  popUpWrapClassName,
}) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [open])

  return (
    <>
      {open && (
        <>
          <div
            className={` fixed left-0 top-0 z-[7000] h-screen w-screen !overflow-hidden  bg-neutral-100/80 backdrop-blur-sm delay-0   duration-200 ease-in-out dark:bg-neutral-200/80 ${overLayClassName}`}
            onClick={handleClose}
          ></div>

          <div
            className={`fixed left-1/2 top-1/2 z-[7001] h-full w-full -translate-x-1/2 -translate-y-1/2 md:h-[90%] md:w-[480px]  ${popUpWrapClassName}`}
          >
            <div className={`${brandGradient} h-[8px] w-full `}></div>
            <div className="relative z-30 h-full rounded-bl-xl rounded-br-xl bg-neutral-800 p-2 dark:bg-neutral-100 md:p-[24px]">
              <div className="flex h-full w-full flex-col">
                <div className="absolute right-[18px] top-[16px] cursor-pointer" onClick={handleClose}>
                  <CrossIcon className="dark:fill-neutral-500" />
                </div>
                <div className="mb-8 mt-[56px] flex w-full  flex-col items-center justify-center pr-[2px]">
                  <Typography
                    className={`text-center    text-h4 font-semibold  leading-[145%] text-black dark:text-neutral-800`}
                    size={'title'}
                  >
                    {label && label}
                  </Typography>

                  <Typography className=" text-center dark:text-neutral-500" size="paragraph">
                    {description}
                  </Typography>
                </div>

                <div className="overflow-y-auto">{children}</div>
              </div>
            </div>
            <div className="fixed left-1/2 top-[32px] z-20 h-full  w-[384px] -translate-x-1/2 rounded-bl-xl rounded-br-xl bg-neutral-800/70 dark:bg-neutral-100/50"></div>
          </div>
        </>
      )}
    </>
  )
}

export default Modal
