import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Chapter5WaterTunnelProps {
  scrollProgress: number
}

// Capped at 360 particles (strictly <= 400 performance limit)
export const MAX_PARTICLE_COUNT = 360

export const Chapter5WaterTunnel: React.FC<Chapter5WaterTunnelProps> = ({
  scrollProgress,
}) => {
  const pointsRef = useRef<THREE.Points>(null)
  const ringsGroupRef = useRef<THREE.Group>(null)

  // Pre-allocate fixed Float32Array for exactly MAX_PARTICLE_COUNT particles (x, y, z)
  const positions = useMemo(() => {
    const pos = new Float32Array(MAX_PARTICLE_COUNT * 3)

    for (let i = 0; i < MAX_PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 0.5 + Math.random() * 2.5
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = Math.sin(angle) * radius
      pos[i * 3 + 2] = -5 - Math.random() * 25
    }
    return pos
  }, [])

  // Recycle particles along Z as camera moves forward
  useFrame((state) => {
    if (!pointsRef.current) return
    const geom = pointsRef.current.geometry
    const attr = geom.attributes.position as THREE.BufferAttribute
    const array = attr.array as Float32Array

    for (let i = 0; i < MAX_PARTICLE_COUNT; i++) {
      // Drift forward slowly
      array[i * 3 + 2] += 0.08
      // Recycle particle when it passes behind the tunnel view
      if (array[i * 3 + 2] > 2) {
        array[i * 3 + 2] = -22
      }
    }
    attr.needsUpdate = true

    // Softly pulse the light rings (gentle sine wave, no neon or flashing)
    if (ringsGroupRef.current) {
      const t = state.clock.getElapsedTime()
      ringsGroupRef.current.children.forEach((child, index) => {
        const mesh = child as THREE.Mesh
        const mat = mesh.material as THREE.MeshStandardMaterial
        if (mat) {
          mat.emissiveIntensity = 0.25 + Math.sin(t * 1.5 + index * 0.8) * 0.15
        }
      })
    }
  })

  // Visible during Chapter 5 (0.60 to 0.90)
  if (scrollProgress < 0.60 || scrollProgress > 0.90) return null

  return (
    <group position={[0, -18, -8]}>
      {/* Blue Water Tunnel Cylinder */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[3.2, 3.2, 28, 32, 1, true]} />
        <meshStandardMaterial
          color="#0284c7"
          emissive="#0369a1"
          emissiveIntensity={0.2}
          roughness={0.15}
          metalness={0.1}
          side={THREE.BackSide}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Soft Light Rings Spaced Along Tunnel */}
      <group ref={ringsGroupRef}>
        {[-4, -10, -16, -22].map((zPos, idx) => (
          <mesh key={idx} position={[0, 0, zPos]}>
            <torusGeometry args={[3.15, 0.06, 16, 32]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={0.3}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>

      {/* Recycled Floating Water Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#7dd3fc"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

export default Chapter5WaterTunnel
