import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { GLASS_VARIANT_CLASSES, type GlassVariant } from '@/lib/glass'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface GlassProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: GlassVariant
  shimmer?: boolean
}

export function Glass({ variant = 'panel', shimmer = false, className, ...props }: GlassProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const reduceMotion = useReducedMotion()
  const blurred = variant === 'panel' || variant === 'popup' || variant === 'bar'
  useEffect(() => {
    if (!shimmer || reduceMotion || !ref.current || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [shimmer, reduceMotion])
  return <div
    ref={ref}
    data-glass-variant={variant}
    {...(blurred ? { 'data-glass-blur': 'true' } : {})}
    {...(shimmer ? { 'data-glass-shimmer': 'true' } : {})}
    data-glass-visible={visible && !reduceMotion}
    className={cn('glass', GLASS_VARIANT_CLASSES[variant], shimmer && 'glass-shimmer', className)}
    {...props}
  />
}

export default Glass
