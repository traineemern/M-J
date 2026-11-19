import { motion, useScroll, useSpring } from 'motion/react'
import { useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface RoadmapConnectorProps {
  isMobile?: boolean
  className?: string
}

export function RoadmapConnector({ isMobile = false, className = '' }: RoadmapConnectorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 85%', 'end 70%'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001,
  })

  if (isMobile) {
    // Vertical line down the left side on mobile aligned with node center
    return (
      <div
        ref={containerRef}
        aria-hidden="true"
        className={`absolute left-5 top-6 bottom-6 w-0.5 pointer-events-none md:hidden ${className}`}
      >
        {/* Background track in water-300 */}
        <div className="absolute inset-0 bg-water-300 w-0.5 rounded-full" />
        {/* Animated drawing line in water-600 */}
        {shouldReduceMotion ? (
          <div className="absolute inset-0 bg-water-600 w-0.5 rounded-full" />
        ) : (
          <motion.div
            className="absolute top-0 left-0 w-0.5 bg-water-600 origin-top rounded-full"
            style={{ scaleY: smoothProgress, height: '100%' }}
          />
        )}
      </div>
    )
  }

  // Desktop central vertical connecting line: track in water-300, active in water-600
  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`absolute left-1/2 -translate-x-1/2 top-10 bottom-10 w-0.5 pointer-events-none hidden md:block ${className}`}
    >
      {/* Background track in water-300 */}
      <div className="absolute inset-0 bg-water-300 w-0.5 rounded-full" />
      {/* Animated active drawing line in water-600 */}
      {shouldReduceMotion ? (
        <div className="absolute inset-0 bg-water-600 w-0.5 rounded-full" />
      ) : (
        <motion.div
          className="absolute top-0 left-0 w-0.5 bg-water-600 origin-top rounded-full shadow-sm"
          style={{ scaleY: smoothProgress, height: '100%' }}
        />
      )}
    </div>
  )
}
