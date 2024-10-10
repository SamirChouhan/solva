import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

import Spinner from '@/design-systems/Atoms/Spinner'
import Typography from '@/design-systems/Atoms/Typography'
import { debounce } from '@/utils'

interface ScrollTriggerProps {
  text?: string
  isLoading?: boolean
  onTrigger?: () => void
  className?: string
}
const PAGE_SCROLL_TRIGGER_DELAY = 300 // Adjust this value as needed

export const ScrollTrigger: React.FC<ScrollTriggerProps> = ({
  text = '',
  isLoading,
  className = '',
  onTrigger: onTrigger_,
}) => {
  const { ref, inView } = useInView()

  useEffect(() => {
    if (!onTrigger_) return
    const onTrigger = debounce(onTrigger_, PAGE_SCROLL_TRIGGER_DELAY)
    if (inView) {
      onTrigger?.()
    }
  }, [onTrigger_, inView])

  return (
    <div className={`invert-fg flex scroll-mb-0 justify-center ${className}`} id="ScrollTrigger" ref={ref}>
      <Typography className="large opacity-60">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center overflow-hidden py-2">
            <div className="animate-spin">
              <Spinner className="h-[36px] w-[36px]" />
            </div>
          </div>
        ) : (
          text
        )}
      </Typography>
    </div>
  )
}
