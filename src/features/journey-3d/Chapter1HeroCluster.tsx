import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Chapter1HeroClusterProps {
  scrollProgress: number
  mouse: { x: number; y: number }
}

export const Chapter1HeroCluster: React.FC<Chapter1HeroClusterProps> = ({
  scrollProgress,
  mouse,
}) => {
  const groupRef = useRef<THREE.Group>(null)

  // Pre-calculate fixed droplet positions and offsets distributed to sides
  const droplets = useMemo(() => [
    { pos: [-2.6, 1.0, -0.5] as [number, number, number], scale: 0.55, speed: 1.1 },
    { pos: [-3.2, -0.6, 0.2] as [number, number, number], scale: 0.45, speed: 0.9 },
    { pos: [2.7, 0.9, -0.4] as [number, number, number], scale: 0.52, speed: 1.3 },
    { pos: [3.3, -0.7, 0.1] as [number, number, number], scale: 0.42, speed: 1.0 },
    { pos: [0, 2.2, -1.2] as [number, number, number], scale: 0.4, speed: 1.2 },
  ], [])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()

    // Gentle float loop
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.12

    // Mouse tilt (max 3 degrees = 0.052 rad)
    const targetRotX = (mouse.y * 0.05).toFixed(4)
    const targetRotY = (mouse.x * 0.05).toFixed(4)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, parseFloat(targetRotX), 0.05)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, parseFloat(targetRotY), 0.05)
  })

  // Visible only in Chapters 1 & 2 (0 to ~0.30)
  const isVisible = scrollProgress <= 0.35
  if (!isVisible) return null

  // Fade out as scroll advances beyond 0.15
  const opacity = Math.max(0, Math.min(1, 1 - (scrollProgress - 0.15) * 5))

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Blue Water Droplets */}
      {droplets.map((d, i) => (
        <mesh key={i} position={d.pos} scale={d.scale}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial
            color="#38bdf8"
            roughness={0.15}
            metalness={0.25}
            transparent
            opacity={0.85 * opacity}
            emissive="#0284c7"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}

      {/* Steel Well Casing Pipes framing the sides */}
      <mesh position={[-3.6, 0.2, -1]} rotation={[0, 0, Math.PI / 14]}>
        <cylinderGeometry args={[0.2, 0.2, 3.8, 20]} />
        <meshStandardMaterial
          color="#0369a1"
          metalness={0.7}
          roughness={0.35}
          transparent
          opacity={0.8 * opacity}
        />
      </mesh>

      <mesh position={[3.6, 0.4, -1.2]} rotation={[0, 0, -Math.PI / 14]}>
        <cylinderGeometry args={[0.18, 0.18, 3.6, 20]} />
        <meshStandardMaterial
          color="#075985"
          metalness={0.75}
          roughness={0.3}
          transparent
          opacity={0.8 * opacity}
        />
      </mesh>
    </group>
  )
}

export default Chapter1HeroCluster
