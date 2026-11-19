import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface CountUpProps {
  end: number
  duration?: number
  suffix?: string
  className?: string
}

export function CountUp({
  end,
  duration = 1.8,
  suffix = '',
  className = '',
}: CountUpProps) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const nodeRef = useRef<HTMLSpanElement | null>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion) {
      setCount(end)
      return
    }

    const currentEl = nodeRef.current
    if (!currentEl) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(currentEl)
    return () => observer.disconnect()
  }, [end, hasStarted, shouldReduceMotion])

  useEffect(() => {
    if (!hasStarted || shouldReduceMotion) return

    let startTimestamp: number | null = null
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1)
      // Ease out expo
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setCount(Math.floor(easeOut * end))

      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        setCount(end)
      }
    }

    requestAnimationFrame(step)
  }, [hasStarted, end, duration, shouldReduceMotion])

  const formattedValue = count.toLocaleString()

  return (
    <span ref={nodeRef} className={className}>
      {formattedValue}
      {suffix}
    </span>
  )
}
