import React, { useRef } from 'react'
import * as THREE from 'three'

interface Chapter2RevealDropletsProps {
  scrollProgress: number
}

export const Chapter2RevealDroplets: React.FC<Chapter2RevealDropletsProps> = ({
  scrollProgress,
}) => {
  const groupRef = useRef<THREE.Group>(null)

  // Visible during Chapter 2 (0.12 to 0.35)
  if (scrollProgress < 0.12 || scrollProgress > 0.38) return null

  // Progress within chapter 2: 0 (at 0.15) to 1 (at 0.30)
  const normProg = Math.max(0, Math.min(1, (scrollProgress - 0.15) / 0.15))
  // Convergence curve: pull together at mid (0.5), separate again at 1.0
  const pullFactor = Math.sin(normProg * Math.PI) // 0 -> 1 -> 0

  return (
    <group ref={groupRef} position={[0, 0, -2]}>
      {/* 4 Converging and separating droplets */}
      {[
        [-1.8, 0.8, 0],
        [1.8, 0.8, 0],
        [-1.2, -0.9, 0],
        [1.2, -0.9, 0],
      ].map(([baseX, baseY, baseZ], idx) => {
        // As pullFactor increases to 1, droplet x and y move towards center (0, 0)
        const currentX = baseX * (1 - pullFactor * 0.75)
        const currentY = baseY * (1 - pullFactor * 0.75)
        const currentScale = 0.4 + pullFactor * 0.25

        return (
          <mesh key={idx} position={[currentX, currentY, baseZ]} scale={currentScale}>
            <sphereGeometry args={[1, 24, 24]} />
            <meshStandardMaterial
              color="#0284c7"
              roughness={0.12}
              metalness={0.3}
              transparent
              opacity={0.88}
              emissive="#38bdf8"
              emissiveIntensity={0.25}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export default Chapter2RevealDroplets
