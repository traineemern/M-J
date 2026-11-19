import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Chapter6SurfaceFinaleProps {
  scrollProgress: number
}

export const Chapter6SurfaceFinale: React.FC<Chapter6SurfaceFinaleProps> = ({
  scrollProgress,
}) => {
  const rippleMeshRef = useRef<THREE.Mesh>(null)

  // Visible during Chapter 6 finale (0.82 to 1.0)
  if (scrollProgress < 0.82) return null

  useFrame((state) => {
    if (!rippleMeshRef.current) return
    const t = state.clock.getElapsedTime()
    // Soft gentle surface shimmer
    rippleMeshRef.current.rotation.z = t * 0.05
  })

  return (
    <group position={[0, -0.5, -4]}>
      {/* Calm Water Surface Disc */}
      <mesh ref={rippleMeshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[8, 36]} />
        <meshStandardMaterial
          color="#0369a1"
          emissive="#0284c7"
          emissiveIntensity={0.25}
          roughness={0.1}
          metalness={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  )
}

export default Chapter6SurfaceFinale
