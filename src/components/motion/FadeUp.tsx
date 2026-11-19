import React from 'react'
import { motion } from 'motion/react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { DURATIONS, EASINGS, TRANSFORMS } from '@/lib/motion'

interface FadeUpProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  yOffset?: number
}

export function FadeUp({
  children,
  delay = 0,
  duration = DURATIONS.reveal,
  className = '',
  yOffset = TRANSFORMS.revealY, // 16px
}: FadeUpProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration,
        delay,
        ease: EASINGS.easeOut,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
