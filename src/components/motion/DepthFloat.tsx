import React from 'react'
import { motion } from 'motion/react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface DepthFloatProps {
  children: React.ReactNode
  distance?: number // default 6px
  duration?: number // default 4s
  className?: string
}

export const DepthFloat: React.FC<DepthFloatProps> = ({
  children,
  distance = 6,
  duration = 4,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={`inline-block group/float hover:[animation-play-state:paused] ${className}`}
      animate={{
        y: [-distance, distance, -distance],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      whileHover={{ y: 0, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  )
}

export default DepthFloat
