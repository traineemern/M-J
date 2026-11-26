import type { ReactNode } from 'react'
import { motionConfig } from '@/lib/motion/config'

export function Marquee({
  children,
  className = '',
  label = 'Scrolling information',
}: {
  children: ReactNode
  className?: string
  label?: string
}) {
  return (
    <div className={`night-marquee ${className}`} tabIndex={0} aria-label={label}>
      <div className="night-marquee__track" style={{ animationDuration: `${motionConfig.marquee.duration}s` }}>
        <div className="night-marquee__group">{children}</div>
        <div className="night-marquee__group" aria-hidden="true">{children}</div>
      </div>
    </div>
  )
}
