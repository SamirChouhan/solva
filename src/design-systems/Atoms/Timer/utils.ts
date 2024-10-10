import { TimerSize } from './interface'

export const getLabelClassName = (size: TimerSize) => {
  switch (size) {
    case 'small':
    case 'medium':
      return 'text-md font-RobotoCondensed'
    case 'large':
      return 'text-sm'
  }
}

export const getTimerClassName = (size: TimerSize) => {
  switch (size) {
    case 'small':
      return 'text-xs font-RobotoCondensed'
    case 'medium':
      return 'md:text-paragraph text-xs font-RobotoCondensed'
    case 'large':
      return 'md:text-h4 md:leading-h4 md:tracking-h4 text-paragraph leading-paragraph tracking-paragraph md:font-bold font-medium font-RobotoCondensed'
    default:
      throw 'Wrong Timer size ' + size
  }
}
