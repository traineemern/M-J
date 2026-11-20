import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const JourneyScene = lazy(() => import('@/features/journey-3d/JourneyScene'))

/** Surface-only isometric view used in the homepage story slot. */
export function SurfaceDiorama() {
  const hostRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const isMobile = useIsMobile(768)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { rootMargin: '300px' })
    observer.observe(host)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={hostRef} aria-label="M&J Water Wells surface diorama" className="relative h-[430px] overflow-hidden bg-water-100 sm:h-[560px]">
      {visible && !reducedMotion ? (
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
      <span className="sr-only">{reducedMotion ? 'Static diorama shown because reduced motion is enabled.' : 'Surface diorama with aligned wells, buildings, truck, rig, trees, fence, and pond.'}</span>
    </section>
  )
}

export default SurfaceDiorama
