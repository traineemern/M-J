import React from 'react'
import { motion } from 'motion/react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { MOTION_PRESETS } from '@/lib/motion'

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <>{children}</>
  }

  return (
    <motion.div className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      <motion.span aria-hidden="true" className="page-transition-sweep pointer-events-none fixed left-0 right-0 top-0 z-[100] h-[3px] bg-gradient-to-r from-transparent via-white to-aqua shadow-[0_0_12px_#2ec4b6]" initial={{ x: '-100vw', opacity: 0 }} animate={{ x: '100vw', opacity: [0, 1, 0] }} transition={{ ...MOTION_PRESETS.glowIn, duration: 0.25 }} />
      {children}
    </motion.div>
  )
}
