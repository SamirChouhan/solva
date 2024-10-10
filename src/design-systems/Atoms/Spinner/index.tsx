import { CircleIcon } from '../Icons'

import { SpinnerProps } from './interface'

const Spinner: React.FC<SpinnerProps> = ({ className }) => {
  return <CircleIcon className={`${className}`} />
}

export default Spinner
