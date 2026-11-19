import React, { Suspense, useState, useEffect } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface HeroSceneProps {
  posterSrc?: string
  posterAlt?: string
  className?: string
}

// Lazy load the Three.js canvas bundle ONLY when Level C criteria are satisfied
const Hero3DCanvas = React.lazy(() => import('./Hero3DCanvas'))

/**
 * Checks if the current client allows Level C (3D Three.js scene):
 * - Screen width >= 768px (desktop / tablet)
 * - prefers-reduced-motion is false
 * - Save-Data header / client connection data saver is false
 */
export function canLoadLevelC(): boolean {
  if (typeof window === 'undefined') return false

  // 1. Mobile check: Never below 768px
  if (window.innerWidth < 768) return false

  // 2. Reduced motion check
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reducedMotion) return false

  // 3. Data saver check
  const nav = navigator as unknown as { connection?: { saveData?: boolean } }
  if (nav.connection?.saveData === true) return false

  return true
}

export const HeroScene: React.FC<HeroSceneProps> = ({
  posterSrc = '/images/mj-crew-photo.jpg',
  posterAlt = 'M&J Water Wells crew and rotary drilling rig outside Casnovia headquarters',
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion()
  const [shouldRender3D, setShouldRender3D] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)

    // Lazy load after first paint
    const timer = setTimeout(() => {
      if (canLoadLevelC() && !shouldReduceMotion) {
        setShouldRender3D(true)
      }
    }, 120)

    return () => clearTimeout(timer)
  }, [shouldReduceMotion])

  // Static poster fallback when conditions are not met or prior to lazy load
  if (!hasMounted || !shouldRender3D || shouldReduceMotion) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        <img
          src={posterSrc}
          alt={posterAlt}
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>
    )
  }

  return (
    <div className={`relative w-full h-full bg-gradient-to-br from-water-950 via-water-900 to-sky-950 overflow-hidden ${className}`}>
      {/* Accessible text alternative for screen readers */}
      <span className="sr-only">
        Animated illustration of water rising in a well.
      </span>

      {/* Level C 3D Canvas */}
      <div className="w-full h-full" aria-hidden="true" data-testid="hero-3d-canvas">
        <Suspense
          fallback={
            <img
              src={posterSrc}
              alt={posterAlt}
              className="w-full h-full object-cover opacity-90"
            />
          }
        >
          <Hero3DCanvas />
        </Suspense>
      </div>

      {/* Decorative badge overlay indicating 3D simulation */}
      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-water-900/80 backdrop-blur-md border border-white/20 text-[10px] font-condensed uppercase tracking-wider text-sky-200 pointer-events-none select-none">
        3D Well Sim
      </div>
    </div>
  )
}

export default HeroScene
