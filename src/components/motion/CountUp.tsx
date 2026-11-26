import { motionConfig } from '@/lib/motion/config'

interface CountUpProps {
  end: number
  duration?: number
  suffix?: string
  className?: string
}

export function CountUp({
  end,
  duration = motionConfig.duration.counter,
  suffix = '',
  className = '',
}: CountUpProps) {
  return (
    <span
      className={className}
      data-count={end}
      data-count-duration={duration}
      data-count-suffix={suffix}
    >
      {end.toLocaleString()}{suffix}
    </span>
  )
}
