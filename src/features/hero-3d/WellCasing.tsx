import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { DoubleSide } from 'three'

export const WellCasing: React.FC = () => {
  const groupRef = useRef<Group>(null)

  // Very slow rotation to give dimension to the steel well casing
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    groupRef.current.rotation.y = t * 0.15
  })

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* Outer steel well casing pipe */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[1.3, 1.3, 2.2, 32, 1, true]} />
        <meshStandardMaterial
          color="#075985"
          metalness={0.75}
          roughness={0.35}
          side={DoubleSide}
        />
      </mesh>

      {/* Casing top reinforcement collar */}
      <mesh position={[0, 0.5, 0]}>
        <torusGeometry args={[1.3, 0.08, 16, 32]} />
        <meshStandardMaterial
          color="#38bdf8"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Mid-collar ring */}
      <mesh position={[0, -0.4, 0]}>
        <torusGeometry args={[1.31, 0.06, 16, 32]} />
        <meshStandardMaterial
          color="#0284c7"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Groundwater disk rising inside casing */}
      <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.25, 32]} />
        <meshStandardMaterial
          color="#06b6d4"
          roughness={0.1}
          metalness={0.2}
          transparent
          opacity={0.85}
          emissive="#0891b2"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  )
}

export default WellCasing
