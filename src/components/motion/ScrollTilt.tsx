import React, { useRef, useEffect } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface ScrollTiltProps {
  children: React.ReactNode
  className?: string
  maxRotation?: number // degrees, e.g. 10 deg
}

export const ScrollTilt: React.FC<ScrollTiltProps> = ({
  children,
  className = '',
  maxRotation = 8,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion || typeof window === 'undefined' || !containerRef.current) return

    const element = containerRef.current
    let active = true
    let revert = () => {}
    void import('@/lib/motion/gsap').then(({ gsap }) => {
      if (!active) return
      const context = gsap.context(() => {
        gsap.fromTo(
          element,
          { rotateX: maxRotation, opacity: 0.85, scale: 0.98 },
          {
            rotateX: 0,
            opacity: 1,
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              end: 'top 40%',
              scrub: 0.6,
            },
          },
        )
      }, element)
      revert = () => context.revert()
    })

    return () => {
      active = false
      revert()
    }
  }, [shouldReduceMotion, maxRotation])

  return (
    <div
      ref={containerRef}
      className={`will-change-transform ${className}`}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  )
}

export default ScrollTilt
