import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface ScrollProgressPathProps {
  containerRef: React.RefObject<HTMLElement | null>
  pathSelector?: string
  onStepProgress?: (activeStep: number) => void
}

/**
 * Lazy-loads GSAP + ScrollTrigger only on mount.
 * Scrubs the road path drawing to scroll position (scrub: true).
 * Respects prefers-reduced-motion by keeping path fully drawn immediately.
 */
export function useRoadmapScrollTrigger({
  containerRef,
  pathSelector = 'path[data-road-path]',
  onStepProgress,
}: ScrollProgressPathProps) {
  const shouldReduceMotion = useReducedMotion()
  const stRef = useRef<unknown>(null)

  useEffect(() => {
    if (shouldReduceMotion) return
    const container = containerRef.current
    if (!container || typeof window === 'undefined') return

    let isMounted = true

    // Dynamically lazy-load GSAP and ScrollTrigger
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (!isMounted) return
        gsap.registerPlugin(ScrollTrigger)

        const path = container.querySelector<SVGPathElement>(pathSelector)
        if (!path || typeof path.getTotalLength !== 'function') return

        const length = path.getTotalLength()
        path.style.strokeDasharray = `${length}`
        path.style.strokeDashoffset = `${length}`

        const st = ScrollTrigger.create({
          trigger: container,
          start: 'top 75%',
          end: 'bottom 85%',
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress
            path.style.strokeDashoffset = `${length * (1 - progress)}`
            // 8 steps: calculate active step index
            if (onStepProgress) {
              const currentStep = Math.min(8, Math.max(1, Math.ceil(progress * 8)))
              onStepProgress(currentStep)
            }
          },
        })

        stRef.current = st
      })
      .catch((err) => {
        console.error('Failed to lazy load GSAP ScrollTrigger:', err)
      })

    return () => {
      isMounted = false
      if (stRef.current && typeof (stRef.current as { kill: () => void }).kill === 'function') {
        ;(stRef.current as { kill: () => void }).kill()
      }
    }
  }, [containerRef, pathSelector, onStepProgress, shouldReduceMotion])
}

export function ScrollProgressPath(props: ScrollProgressPathProps) {
  useRoadmapScrollTrigger(props)
  return null
}

export default ScrollProgressPath
