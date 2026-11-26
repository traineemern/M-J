import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const JourneyScene = lazy(() => import('@/features/journey-3d/JourneyScene'))

function supportsWebGL(): boolean {
  try {
    const context = document.createElement('canvas').getContext('webgl')
    if (!context) return false
    context.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}

/** Surface-only isometric view used in the homepage story slot. */
export function SurfaceDiorama({ className = '' }: { className?: string }) {
  const hostRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [webglSupported, setWebglSupported] = useState(false)
  const isMobile = useIsMobile(768)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    setWebglSupported(supportsWebGL())
    const host = hostRef.current
    if (!host) return
    if (!('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting)
    }, { rootMargin: '300px' })
    observer.observe(host)
    return () => observer.disconnect()
  }, [])

  const showModel = visible && webglSupported && !reducedMotion

  return (
    <section
      ref={hostRef}
      aria-label="M&J Water Wells surface diorama"
      className={`relative ${className ? 'h-full w-full' : 'h-[430px] sm:h-[560px]'} overflow-hidden bg-water-100 ${className}`}
    >
      {showModel ? (
        <Canvas
          aria-hidden="true"
          gl={{ alpha: true, antialias: !isMobile, powerPreference: 'low-power' }}
          dpr={isMobile ? 1 : 1.25}
          shadows={!isMobile}
          camera={{ fov: 34, near: 0.1, far: 150, position: [37, 34, 37] }}
        >
          <Suspense fallback={null}><JourneyScene progress={0} isMobile={isMobile} surfaceOnly /></Suspense>
        </Canvas>
      ) : (
        <img src="/images/diorama-poster.webp" alt="Isometric surface diorama showing the farmhouse, three well heads, pump house, storage tank, service truck, drill rig, trees, fence, and pond" width={1280} height={850} loading="lazy" className="h-full w-full object-cover" />
      )}
      <span className="sr-only">{showModel ? 'Interactive 3D surface diorama with wells, buildings, truck, rig, trees, fence, and pond.' : 'Static diorama shown as a fallback.'}</span>
    </section>
  )
}

export default SurfaceDiorama
