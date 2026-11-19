import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface ParallaxLayerProps {
  children: React.ReactNode
  speed?: number // negative moves slower (behind), positive moves faster (ahead)
  className?: string
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  speed = -0.15,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, speed * 100])

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="w-full h-full will-change-transform">
        {children}
      </motion.div>
    </div>
  )
}

export default ParallaxLayer
