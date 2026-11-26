import React, { useEffect } from 'react'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const canSmoothScroll =
      window.matchMedia('(min-width: 1024px)').matches &&
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!canSmoothScroll) return

    let cleanup: (() => void) | undefined
    let cancelled = false
    void import('@/lib/motion/smooth').then((smoothScroll) => {
      if (cancelled) return
      cleanup = smoothScroll.initSmoothScroll()
    })
    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  return <>{children}</>
}
