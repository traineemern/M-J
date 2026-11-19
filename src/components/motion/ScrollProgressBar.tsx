import React from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface ScrollProgressBarProps {
  className?: string
}

export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({ className = '' }) => {
  const { scrollYProgress } = useScroll()
  const shouldReduceMotion = useReducedMotion()

  // Smooth physics spring unless reduced motion is requested
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <div
      role="progressbar"
      aria-label="Page reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      className={`fixed top-0 left-0 right-0 h-[3.5px] z-50 pointer-events-none bg-transparent ${className}`}
    >
      <motion.div
        className="h-full w-full bg-gradient-to-r from-sky-400 via-water-500 to-cyan-300 shadow-[0_0_10px_rgba(56,189,248,0.7)]"
        style={{
          scaleX: shouldReduceMotion ? scrollYProgress : scaleX,
          transformOrigin: '0% 50%',
        }}
      />
    </div>
  )
}

export default ScrollProgressBar
