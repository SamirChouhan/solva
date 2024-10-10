import { useCallback, useMemo } from 'react'
import Countdown, { CountdownRenderProps } from 'react-countdown'

import { TimerProps } from './interface'
import { getLabelClassName, getTimerClassName } from './utils'

import { classNames } from '@/utils'

const getCountRenderer = ({ days, hours, minutes, seconds }: CountdownRenderProps) => {
  const _hours = String(hours).length === 1 ? `0${hours}` : hours
  const _minutes = String(minutes).length === 1 ? `0${minutes}` : minutes
  const _seconds = String(seconds).length === 1 ? `0${seconds}` : seconds
  return days > 0 ? `${days} days` : `${_hours}:${_minutes}:${_seconds}`
}

const fontColor = 'text-neutral-100 dark:text-neutral-600'

export function Timer({ size = 'small', endTime, status = 'in', updateStatus }: TimerProps) {
  const labelClassName = useMemo(() => getLabelClassName(size), [size])
  const timerClassName = useMemo(() => getTimerClassName(size), [size])

  const handleStatusUpdate = useCallback(
    (status: string) => {
      updateStatus?.(status)
    },
    [updateStatus]
  )

  const getCountDown = () => {
    if (status === 'pending') {
      return (
        <Countdown
          date={endTime}
          key={status}
          renderer={getCountRenderer}
          onComplete={() => handleStatusUpdate('listed')}
        />
      )
    } else {
      return (
        <Countdown
          date={endTime}
          key={status}
          renderer={getCountRenderer}
          onComplete={() => handleStatusUpdate('ended')}
        />
      )
    }
  }

  switch (status) {
    case 'pending':
      return (
        <div
          className={classNames(
            'from-18.71% timer_main_wrp absolute left-4 top-[270px] z-10 flex items-center gap-1 rounded-xl bg-gradient-to-t from-pink-400 to-pink-500 to-80% px-4 py-2 !text-md font-bold text-white',
            fontColor
          )}
        >
          <div className={`${labelClassName}`}>Starts In:</div>
          <div className={`${timerClassName} !text-md`}>{getCountDown()}</div>
        </div>
      )
    case 'in':
      return (
        <div
          className={classNames(
            'from-18.71% timer_main_wrp absolute left-4 top-[270px] z-10 flex items-center gap-1 rounded-xl bg-gradient-to-t from-pink-400 to-pink-500 to-80% px-4 py-2 !text-md font-bold text-white',
            fontColor
          )}
        >
          <div className={labelClassName}>Ends In:</div>
          <div className={`${timerClassName} !text-md`}>{getCountDown()}</div>
        </div>
      )
    case 'ended':
      return <div className={classNames(timerClassName, fontColor)}>Ended</div>
    case 'sold':
      return <div className={classNames(timerClassName, fontColor)}>Sold</div>
    default:
      return (
        <div className={classNames('inline-flex flex-col items-end justify-end', fontColor)}>
          <div className={labelClassName}>Ends In</div>
          <div className={timerClassName}>{getCountDown()}</div>
        </div>
      )
  }
}
