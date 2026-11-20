import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

export function Reveal({ children, heading = false, className = '', delay = 0 }: { children: ReactNode; heading?: boolean; className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return <motion.div className={className} initial={heading ? { clipPath: 'inset(0 0 100% 0)' } : { opacity: 0, y: 18 }} whileInView={heading ? { clipPath: 'inset(0 0 0% 0)' } : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55, delay, ease: 'easeOut' }}>{children}</motion.div>
}
