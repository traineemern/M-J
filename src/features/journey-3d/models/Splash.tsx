import React, { useMemo } from 'react'

interface SplashProps {
  progress: number
}

export const Splash: React.FC<SplashProps> = ({ progress }) => {
  // Only active in Beat 8: "Clean water found." (0.83 to 0.905)
  if (progress < 0.83 || progress > 0.905) {
    return null
  }

  // Phase cycles through splash burst (approx 6 loops over beat 8)
  const burstPhase = ((progress - 0.83) / 0.075) * 6

  // 14 instanced droplet trajectories (12 to 16 per spec)
  const dropletPositions = useMemo(() => {
    const droplets = []
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2 + (i % 3) * 0.2
      const speed = 0.6 + (i % 3) * 0.25
      const upwardVel = 1.8 + (i % 3) * 0.4
      droplets.push({ angle, speed, upwardVel, offset: i / 14 })
    }
    return droplets
  }, [])

  return (
    <group position={[0.6, 0.5, 0]}>
      {/* Central water spout core */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.08, 0.16, 0.6, 12]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.6}
          roughness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* 16 Droplet Spheres arcing out and falling */}
      {dropletPositions.map((d, i) => {
        // Individual droplet time 0 to 1
        const t = (burstPhase + d.offset) % 1
        const dist = d.speed * t
        const x = Math.cos(d.angle) * dist
        const z = Math.sin(d.angle) * dist
        // Parabolic vertical trajectory: y = v*t - 0.5*g*t^2
        const y = d.upwardVel * t - 3.8 * t * t

        if (y < -0.4) return null

        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshStandardMaterial
              color="#7dd3fc"
              emissive="#0284c7"
              emissiveIntensity={0.7}
              roughness={0.1}
            />
          </mesh>
        )
      })}
    </group>
  )
}
