import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Chapter4GroundLayersProps {
  scrollProgress: number
}

export const Chapter4GroundLayers: React.FC<Chapter4GroundLayersProps> = ({
  scrollProgress,
}) => {
  const waveMeshRef = useRef<THREE.Mesh>(null)

  // Unconditional hook: check visibility inside callback to adhere strictly to rules-of-hooks
  useFrame((state) => {
    if (scrollProgress < 0.38 || scrollProgress > 0.75) return
    if (!waveMeshRef.current) return
    const t = state.clock.getElapsedTime()
    const geom = waveMeshRef.current.geometry as THREE.PlaneGeometry
    const posAttr = geom.attributes.position

    for (let i = 0; i < posAttr.count; i++) {
      const u = posAttr.getX(i)
      const v = posAttr.getY(i)
      // Slow gentle blue wave undulation
      const z = Math.sin(u * 1.2 + t * 1.2) * 0.15 + Math.cos(v * 1.2 + t * 0.9) * 0.12
      posAttr.setZ(i, z)
    }
    posAttr.needsUpdate = true
  })

  // Visible during Chapter 4 descent (0.40 to 0.72)
  if (scrollProgress < 0.38 || scrollProgress > 0.75) return null

  return (
    <group position={[0, -2, -5]}>
      {/* 1. Top Soil Layer (-2 Y) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[14, 2.5, 8]} />
        <meshStandardMaterial
          color="#3f2e1e"
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>

      {/* 2. Sub Soil Layer (-5.5 Y) */}
      <mesh position={[0, -3.2, 0]}>
        <boxGeometry args={[14, 3.2, 8]} />
        <meshStandardMaterial
          color="#5c442c"
          roughness={0.85}
          metalness={0.1}
        />
      </mesh>

      {/* 3. Ground Water Aquifer Layer with Animated Waves (-9 Y) */}
      <group position={[0, -6.8, 0]}>
        {/* Animated surface plane */}
        <mesh ref={waveMeshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 1.2, 0]}>
          <planeGeometry args={[14, 8, 24, 16]} />
          <meshStandardMaterial
            color="#0ea5e9"
            emissive="#0284c7"
            emissiveIntensity={0.35}
            roughness={0.1}
            metalness={0.3}
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* Aquifer volume block */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[14, 2.4, 8]} />
          <meshStandardMaterial
            color="#0369a1"
            roughness={0.2}
            metalness={0.2}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>

      {/* 4. Bed Rock Layer (-13 Y) */}
      <mesh position={[0, -10.5, 0]}>
        <boxGeometry args={[14, 4.5, 8]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.95}
          metalness={0.3}
        />
      </mesh>

      {/* Center Drilling Borehole / Casing Pipe */}
      <mesh position={[0, -5, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 14, 24]} />
        <meshStandardMaterial
          color="#38bdf8"
          metalness={0.8}
          roughness={0.25}
          emissive="#0284c7"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  )
}

export default Chapter4GroundLayers
