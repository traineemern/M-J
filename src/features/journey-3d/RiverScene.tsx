import React, { useEffect, useState, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RiverWater } from './RiverWater'
import { RiverBanks } from './RiverBanks'
import { GroundCutaway } from './GroundCutaway'
import { RiverSky } from './RiverSky'
import { CameraController } from './CameraController'

interface RiverSceneProps {
  scrollProgress: number
}

export const RiverScene: React.FC<RiverSceneProps> = ({ scrollProgress }) => {
  const { gl } = useThree()
  const [isDebugMode, setIsDebugMode] = useState(false)
  const debugCubeRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setIsDebugMode(params.get('debug') === '3d')
    }
  }, [])

  // Rotate debug cube if visible and log draw calls on change
  useFrame((state) => {
    if (debugCubeRef.current) {
      const t = state.clock.getElapsedTime()
      debugCubeRef.current.rotation.x = t
      debugCubeRef.current.rotation.y = t * 1.5
    }
  })

  // Expose draw call count on window for reporting & testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ;(window as unknown as { __RIVER_DRAW_CALLS__?: number }).__RIVER_DRAW_CALLS__ =
        gl.info.render.calls
    }
  }, [gl])

  return (
    <>
      {/* Directional light (warm, water-100 tint #e0f2fe, intensity 1.5) */}
      <directionalLight
        position={[25, 45, 10]}
        intensity={1.5}
        color="#e0f2fe"
        castShadow={false}
      />

      {/* Hemisphere light (sky water-50 #f0f9ff, ground water-900 #0c4a6e, intensity 1.2) */}
      <hemisphereLight
        color="#f0f9ff"
        groundColor="#0c4a6e"
        intensity={1.2}
      />

      {/* Atmospheric fog with far >= 60 so scene is crisp */}
      <fog attach="fog" args={['#e0f2fe', 40, 260]} />

      {/* Follow camera along river curve */}
      <CameraController scrollProgress={scrollProgress} />

      {/* River Sky Backdrop */}
      <RiverSky />

      {/* Flowing Water Ribbon & Riverbed */}
      <RiverWater scrollProgress={scrollProgress} />

      {/* Instanced Low-Poly Rock & Sand Banks */}
      <RiverBanks />

      {/* Single Ground Aquifer Cutaway (Chapter 4) */}
      <GroundCutaway scrollProgress={scrollProgress} />

      {/* Debug Mode (?debug=3d): Axes helper and bright test cube */}
      {isDebugMode && (
        <group name="debug-3d-group">
          <axesHelper args={[10]} />
          <mesh
            ref={debugCubeRef}
            position={[0, 4, -8]}
            name="debug-test-cube"
          >
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshBasicMaterial color="#ff0055" wireframe={false} />
          </mesh>
        </group>
      )}
    </>
  )
}

export default RiverScene
