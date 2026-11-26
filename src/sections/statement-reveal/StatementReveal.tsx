import { useIsMobile } from '@/hooks/useIsMobile'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function StatementReveal({ text, className = '' }: { text: string; className?: string }) {
  const mobile = useIsMobile(900)
  const reduced = useReducedMotion()
  const canRevealWords = !mobile && !reduced

  return (
    <p
      className={`statement-reveal ${className}`}
      data-motion={canRevealWords ? 'words' : undefined}
      data-split={canRevealWords ? 'words' : undefined}
    >
      {text}
    </p>
  )
}
