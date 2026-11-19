import React, { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { RiverScene } from './RiverScene'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface JourneyCanvasProps {
  scrollProgress: number
}

export const JourneyCanvas: React.FC<JourneyCanvasProps> = ({ scrollProgress }) => {
  const [isTabHidden, setIsTabHidden] = useState(false)

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabHidden(document.hidden)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Call ScrollTrigger.refresh() after canvas mounts and fonts ready
    if (typeof window !== 'undefined') {
      ScrollTrigger.refresh()
      if (document.fonts) {
        document.fonts.ready.then(() => {
          ScrollTrigger.refresh()
        })
      }
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Pause render loop when tab is hidden or offscreen to preserve battery
  const frameloop = isTabHidden ? 'never' : 'always'

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 w-full h-full overflow-hidden"
      style={{ height: '100vh', width: '100vw' }}
      aria-hidden="true"
      data-testid="journey-canvas-container"
    >
      <Suspense fallback={null}>
        <Canvas
          frameloop={frameloop}
          dpr={[1, 1.5]} // Pixel ratio strictly capped at 1.5 max
          camera={{
            position: [0, 3, 0],
            fov: 52,
            near: 0.1,
            far: 500, // Near 0.1, far at least 500 per spec
          }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        >
          {/* Continuous Procedural 3D River Scene */}
          <RiverScene scrollProgress={scrollProgress} />
        </Canvas>
      </Suspense>
    </div>
  )
}

export default JourneyCanvas
