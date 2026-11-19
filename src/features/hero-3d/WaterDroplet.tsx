import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { Vector2 } from 'three'

export const WaterDroplet: React.FC = () => {
  const meshRef = useRef<Mesh>(null)

  // Subtle floating and rotation animation over time
  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.y = t * 0.8
    meshRef.current.position.y = 0.5 + Math.sin(t * 1.5) * 0.15
  })

  // Create teardrop geometry via lathe points
  const points = React.useMemo(() => {
    const pts: Vector2[] = []
    const count = 30
    for (let i = 0; i <= count; i++) {
      const u = i / count
      const theta = u * Math.PI
      // Droplet profile formula
      const radius = Math.sin(theta) * Math.pow(Math.cos(theta / 2), 1.2) * 0.7
      const y = -1.2 + u * 2.2
      pts.push(new Vector2(radius, y))
    }
    return pts
  }, [])

  return (
    <mesh ref={meshRef} castShadow position={[0, 0.5, 0]}>
      <latheGeometry args={[points, 36]} />
      <meshStandardMaterial
        color="#38bdf8"
        roughness={0.1}
        metalness={0.3}
        transparent
        opacity={0.88}
        emissive="#0284c7"
        emissiveIntensity={0.25}
      />
    </mesh>
  )
}

export default WaterDroplet
