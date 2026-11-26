import type { ReactNode } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export function HomeReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <div ref={ref} className={`home-reveal ${className}`} data-revealed={isVisible}>
      {children}
    </div>
  )
}
