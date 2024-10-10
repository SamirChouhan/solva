export function classNames(...classes: (false | null | undefined | string)[]): string {
  return classes.filter(Boolean).join(' ')
}

export const brandGradient = 'bg-gradient-to-t from-pink-400 from-18.71%   to-pink-500 to-80%'
