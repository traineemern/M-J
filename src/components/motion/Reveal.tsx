import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface RevealProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  yOffset?: number
}

export function Reveal({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
  yOffset = 24,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion()
  const [forcedRevealed, setForcedRevealed] = useState(false)

  useEffect(() => {
    if (shouldReduceMotion) return

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
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
