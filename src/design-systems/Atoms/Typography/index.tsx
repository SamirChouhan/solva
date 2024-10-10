import { TypographyProps } from './interface'
import { getFontFamily, getFontSize } from './utils'

/**
 * @description Typography component
 *
 * h1: 64px
 * h2: 48px
 * h3: 38px
 * h4: 28px
 * subtitle: 24px
 * paragraph: 20px
 * body: 16px
 * caption: 12px
 * small: 10px
 */
const Typography: React.FC<TypographyProps> = ({ variant = 'regular', size, className = '', children, tabIndex }) => {
  const classNames = [variant && getFontFamily(variant), size && getFontSize(size), className].join(' ')
  return (
    <div className={classNames} tabIndex={tabIndex}>
      {children}
    </div>
  )
}
export default Typography
