import React, { useEffect, useState } from 'react'
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
  const [forcedRevealed, setForcedRevealed] = useState(false)

  useEffect(() => {
    if (shouldReduceMotion) return

    // Failsafe: if an element has not revealed 1.5 seconds after it mounts, force it to its final state
    const timer = setTimeout(() => {
      setForcedRevealed(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [shouldReduceMotion])

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={forcedRevealed ? false : { opacity: 0, y: yOffset }}
      animate={forcedRevealed ? { opacity: 1, y: 0 } : undefined}
      whileInView={forcedRevealed ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05, margin: '0px 0px -10% 0px' }}
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
