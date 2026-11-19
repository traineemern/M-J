import React, { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { CameraController } from './CameraController'
import { Chapter1HeroCluster } from './Chapter1HeroCluster'
import { Chapter2RevealDroplets } from './Chapter2RevealDroplets'
import { Chapter4GroundLayers } from './Chapter4GroundLayers'
import { Chapter5WaterTunnel } from './Chapter5WaterTunnel'
import { Chapter6SurfaceFinale } from './Chapter6SurfaceFinale'

interface JourneyCanvasProps {
  scrollProgress: number
}

export const JourneyCanvas: React.FC<JourneyCanvasProps> = ({ scrollProgress }) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [isTabHidden, setIsTabHidden] = useState(false)

  // Track mouse coordinates for desktop subtle tilt in Chapter 1
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1 .. 1
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      setMouse({ x, y })
    }

    const handleVisibilityChange = () => {
      setIsTabHidden(document.hidden)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Pause render loop when tab is hidden to save battery and GPU cycles
  const frameloop = isTabHidden ? 'never' : 'always'

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <Canvas
          frameloop={frameloop}
          dpr={[1, 1.5]} // Capped at 1.5 max pixel ratio
          camera={{ position: [0, 0, 5], fov: 48 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'low-power',
          }}
          style={{ background: 'transparent' }}
        >
          {/* Ambient & Directional Blue Theme Lighting */}
          <ambientLight intensity={0.8} color="#e0f2fe" />
          <directionalLight position={[5, 8, 4]} intensity={1.4} color="#ffffff" />
          <pointLight position={[-4, -3, 2]} intensity={0.6} color="#0284c7" />

          {/* Camera Motion Controller linked to scrollProgress */}
          <CameraController scrollProgress={scrollProgress} />

          {/* Chapter 1: Floating Droplets + Pipes Cluster */}
          <Chapter1HeroCluster scrollProgress={scrollProgress} mouse={mouse} />

          {/* Chapter 2: Droplets converging & separating */}
          <Chapter2RevealDroplets scrollProgress={scrollProgress} />

          {/* Chapter 4: Cutaway Ground Layers & Animated Waves */}
          <Chapter4GroundLayers scrollProgress={scrollProgress} />

          {/* Chapter 5: Blue Water Tunnel with Particles & Light Rings */}
          <Chapter5WaterTunnel scrollProgress={scrollProgress} />

          {/* Chapter 6: Calm Surface Emergence */}
          <Chapter6SurfaceFinale scrollProgress={scrollProgress} />
        </Canvas>
      </Suspense>
    </div>
  )
}

export default JourneyCanvas
